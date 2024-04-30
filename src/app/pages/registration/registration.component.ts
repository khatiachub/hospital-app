import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../../core/data-service.service';
import { ThumbnailService } from '../../core/thumbnail.service';
import { Category } from '../../shared/Category.interface';
import { User } from '../../shared/User.interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('imageInput') imageInput: any;
  EmailUsedError:boolean=false;
  onImageClick() {
    this.imageInput.nativeElement.click();
  }
  onFileClick() {
    this.fileInput.nativeElement.click();
  }

  form = new FormGroup({
    Name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    LastName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    PrivateNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(11),
    ]),
    Password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/
      ),
    ]),
    Role: new FormControl('', Validators.required),
    Cv: new FormControl(''),
    ProfileImage: new FormControl(''),
    Category: new FormControl(''),
    Description: new FormControl(''),
  });

  type: any;
  categories:Category[]=[];
  allUsers:User[]=[]
  ngOnInit(): void {
    this.dataService.getCategories().subscribe((response) => {
      this.categories = response;
    });
    this.dataService.getAllUsers().subscribe((response) => {
      this.allUsers = response;      
    });
  }
  constructor(
    private dataService: DataService,
    private thumbnailService: ThumbnailService,
    private translate:TranslateService
  ) {
    this.type = history.state.type;    
    if (this.type === 'ექიმი'||this.type === 'Doctor') {
      this.form.get('Role')!.setValue('DOCTOR');
    } else if (this.type === 'ადმინისტრატორი'||this.type === 'administrator') {
      this.form.get('Role')!.setValue('ADMIN');
    } else {
      this.form.get('Role')!.setValue('USER');
    }
  }

  public success = false;
  goToLoginPage() {
    this.dataService.data$.subscribe((data) => {
      data = true;
    });
  }

  thumbnailUrl: any;
  onFileSelected(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file && controlName === 'ProfileImage') {
      this.generateThumbnailAndSetValue(file, controlName);
    } else {
      this.form.get(controlName)?.setValue(file);
    }
  }

  generateThumbnailAndSetValue(file: File, controlName: string): void {
    this.generateThumbnail(file)
      .then((thumbnailFile: File) => {
        this.form.get(controlName)?.setValue(thumbnailFile);
        this.thumbnailUrl = thumbnailFile;
      })
      .catch((error: any) => {
        console.error('Error generating thumbnail:', error);
      });
  }
  async generateThumbnail(file: File): Promise<File> {
    try {
      const resolvedFile = await this.thumbnailService.generateThumbnail(
        file,
        200,
        200
      );
      return resolvedFile;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error;
    }
  }

  registration(): void {
    const data = this.form.value;
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = this.form.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key.toString(), value.toString());
      }
    });

    const cvFile = this.form.get('Cv')?.value;
    if (cvFile) {
      formData.append('Cv', cvFile);
    }

    const name = this.form.get('Name')?.value;
    if (name) {
      formData.append('name', name);
    }
    const lastname = this.form.get('LastName')?.value;
    if (lastname) {
      formData.append('lastName', lastname);
    }
    const email = this.form.get('Email')?.value;
    if (email) {
      formData.append('email', email);
    }
    const privnumb = this.form.get('PrivateNumber')?.value;
    if (privnumb) {
      formData.append('PrivateNumber', privnumb.toString());
    }
    const img = this.form.get('ProfileImage')?.value;
    if (img) {
      formData.append('ProfileImage', img);
    }

    const pass = this.form.get('Password')?.value;
    if (pass) {
      formData.append('Password', pass);
    }
    const desc = this.form.get('Description')?.value;
    if (desc) {
      formData.append('Description', desc);
    }

    if (this.form.valid) {
      if (this.type === 'ექიმი'||this.type === 'doctor') {
        this.dataService.registerDoctorAndAdmin(formData).subscribe({
          next: (response) => {
            const isEmailUsed=this.allUsers.some((user:User)=>(user.email===this.form.get('Email')?.value))
            if(isEmailUsed){
              this.EmailUsedError=this.translate.instant('isEmailUsed')
            }else{
              this.success = true;
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            }
          },
          error: (error) => {
            this.EmailUsedError=true;
            console.log('fffkfk');
            
          },
        });
      } else {
        this.dataService.registration(formData).subscribe({
          next: (response) => {
            const isEmailUsed=this.allUsers.some((user:User)=>(user.email===this.form.get('Email')?.value))
            if(isEmailUsed){
              this.EmailUsedError=true;          
            }else{
              this.success = true;
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            }
          },
          error: (error) => {
            this.EmailUsedError=true;
            console.log(error);
            
          },
        });
      }
    } else {
      Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}
