import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    Email: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
  });
  constructor(private dataService:DataService,private router: Router) {}



public Code=false;
public enterCode:string='';
public responseData!:any;
codeGenerationSubscription!: Subscription;
enableGenerateButton: boolean = true;
enabled:boolean=false;
LoginEnabled=true;
enterEmail!:any;
SendEmail=false;
EnterRecoverCode=false;
EnterRecover!:string;
EnableNewPassword=false;
RecoveryData:any;
RecoverySuccess=false;


  Login():void{ 
    const data = this.form.value;        
    if (this.form.valid) {
      this.dataService.login(data).subscribe({
        next: (response) => {
          if(response?.code){
              this.Code=true;
              this.LoginEnabled=false;
              this.responseData=response;
              
          }else{
            localStorage.setItem('token', response.token);
            localStorage.setItem('id', response.id);
            localStorage.setItem('role',response.role)
            this.router.navigate(['home']).then(() => {
              window.location.reload();
            });            
          }
        },
        error: (error) => {
          console.error('POST request failed:', error);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  } 

  handleChange(event:any):void{
    this.enterCode=event.target.value;
  }

  errorCode:boolean=false;
  sendCode():void{
    console.log(this.responseData);
    
    this.responseData.newCode=this.enterCode;    
    this.dataService.enterCode(this.responseData).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('id', response.id);        
        this.router.navigate(['home']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.errorCode=true;
        console.log(error);
      },
    });
  }

  public Time!:string;
  ngOnInit() {
    this.startInterval();
    if(this.remainingTime===0){
      this.Time=''
    }
  }

  startInterval() {
    this.codeGenerationSubscription = interval(1000).subscribe(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      }else{
        this.codeGenerationSubscription.unsubscribe();
      }
    });
  }
  ngOnDestroy() {
    if (this.codeGenerationSubscription) {
      this.codeGenerationSubscription.unsubscribe();
    }
  }
  public remainingTime!:number;
  sendCodeAgain():void{
    this.remainingTime = 60;
    this.enableGenerateButton = false;
    this.enabled=true;
    this.startInterval();
    this.Login();
    setTimeout(() => {
      this.enableGenerateButton = true;
    }, 60000);
  }

  handleInputChange(event:any):void{
    const name=event.target.name
    const value=event.target.value
    this.enterEmail = { ...this.enterEmail, [name]: value };
  }

  redirectToPasswordReset():void{
    this.SendEmail=true;
    this.LoginEnabled=false;
  }

  sendEmail():void{
    const data={
      email:this.enterEmail.enterEmail
    }
    
    this.dataService.sendEmail(data).subscribe({
      next:(response)=>{
        this.EnterRecoverCode=true;
        this.SendEmail=false;
        this.RecoveryData=response;        
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  sendResetCode():void{
    this.RecoveryData.newCode=this.enterEmail.EnterRecoverCode;
    
    this.dataService.sendResetCode(this.RecoveryData).subscribe({
      next:(response)=>{
        console.log(response);
        this.EnableNewPassword=true;
        this.EnterRecoverCode=false;
        this.RecoveryData=response;
      },
      error:(error)=>{
        this.errorCode=true;
        console.log(error);
        
      }
    })
  }

  sendResetCodeAgain():void{
      this.remainingTime = 60;
      this.enableGenerateButton = false;
      this.enabled=true;
      this.startInterval();
      this.sendEmail();
      setTimeout(() => {
        this.enableGenerateButton = true;
      }, 60000);
  }
  matchError:string='';
  validateError:string='';
  resetPassword():void{
    this.RecoveryData.newPassword=this.enterEmail.newPassword
    this.RecoveryData.confirmPassword=this.enterEmail.confirmPassword
    if(this.RecoveryData.newPassword!==this.RecoveryData.confirmPassword){
      this.matchError='პაროლები არ ემთხვევა'
    }else{
      this.dataService.enterNewPassword(this.RecoveryData).subscribe({
        next:(response)=>{
          this.EnableNewPassword=false;
          this.RecoverySuccess=true;
          setTimeout(() => {
            this.LoginEnabled = true;
            this.RecoverySuccess=false;
          }, 3000);      
        },
        error:(error)=>{
          this.matchError='';
          this.validateError='სავალდებულოა მინიმუმ 8 სიმბოლო'
        }
      })
    }
    
  }
}

