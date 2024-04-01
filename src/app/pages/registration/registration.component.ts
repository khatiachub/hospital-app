import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../core/data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/User.interface';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  form = new FormGroup({
    Name: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    Email: new FormControl('', Validators.required),
    PrivateNumber: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
    Role: new FormControl('', Validators.required),
    Cv: new FormControl(''),
    ProfileImage: new FormControl(''),
    Category: new FormControl(''),
  });


  type:any;
  categories:any;
  ngOnInit(): void {
    this.dataService.getCategories().subscribe((response) => {
      console.log('category get successfully');
      this.categories=response;
    }); 
 }
  constructor(private dataService:DataService) {
    this.type = history.state.type; 
       
  if (this.type==='ექიმი') {
    this.form.get('Role')!.setValue('DOCTOR');
  }else if(this.type==='ადმინისტრატორი'){
    this.form.get('Role')!.setValue('ADMIN');
  }
   else {
    this.form.get('Role')!.setValue('USER');
  }}

  public success=false;
  goToLoginPage() {
    this.dataService.data$.subscribe(data => {
      data=true;
    });
  }
  

  onFileSelected(event:any,controlName:string): void {
    const file = event.target.files[0];

    this.form.get(controlName)?.setValue(file);

  }


  registration():void{ 
    const data=this.form.value;    
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = this.form.get(key)?.value; 
      if (value !== null && value !== undefined) {
        formData.append(key.toString(), value.toString());        
      }
    });

    
    const cvFile = this.form.get('Cv')?.value; 
    if (cvFile) {
      formData.append('Cv',cvFile);
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

    if (this.form.valid) {
      if(this.type==='ექიმი'){
        this.dataService.registerDoctorAndAdmin(formData).subscribe({
          next: (response) => {
            console.log('account created successfully:', response);
            this.success=true;
            setTimeout(() => {
              window.location.reload();
            }, 5000);          
          },
          error: (error) => {
            console.error('POST request failed:', error);
            // console.log(formData);
            
          },
        });
      }
      else{
        this.dataService.register(formData).subscribe({
          next: (response) => {
            console.log('POST request successful:', response);
            this.success=true;
            setTimeout(() => {
              window.location.reload();
            }, 5000);          
          },
          error: (error) => {
            console.error('POST request failed:', error);
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  } 
  
}


