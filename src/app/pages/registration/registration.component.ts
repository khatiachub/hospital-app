import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../core/data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { categories } from '../../shared/categories.data';


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
  ngOnInit(): void {
    // this.type = history.state.type;
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
    this.encodeFileToBase64(file,controlName);
  }

  encodeFileToBase64(file: File,controlName:string): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String: string = reader.result!.toString().split(',')[1];
      this.form.get(controlName)!.setValue(base64String);
    };
    reader.readAsDataURL(file);
  }


  registration():void{ 
    const data = this.form.value;
    console.log(data);
     
    if (this.form.valid) {
      if(this.type==='ექიმი'){
        this.dataService.registerDoctorAndAdmin(data).subscribe({
          next: (response) => {
            console.log('account created successfully:', response);
            this.success=true;
            setTimeout(() => {
              window.location.reload();
            }, 5000);          
          },
          error: (error) => {
            console.error('POST request failed:', error);
          },
        });
      }else{
        
        this.dataService.register(data).subscribe({
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
  
  categories=categories;
}


