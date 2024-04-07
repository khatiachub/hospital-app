import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { response } from 'express';

@Component({
  selector: 'app-edituserprofile',
  templateUrl: './edituserprofile.component.html',
  styleUrl: './edituserprofile.component.scss'
})
export class EdituserprofileComponent implements OnInit {
  constructor(private dataService:DataService) {}
  id!:string;
  user!:any;
  OpenWindow=false;
  inputValue!: string;
  data!:any;
  property!:string;
  currentPassword!: string;
  newPassword!: string;
  OpenWindowForPassword=false;
  OpenWindowForEmail=false;
  EnterCode=false;
  EnterNewEmail=false;
  EnterNewEmailCode=false;
  public url='http://localhost:5134/Upload/Files/'
  Role=history.state.type;
  UserRole!:string;

  ngOnInit(): void {
    this.id = history.state.id;    
    if(this.id){
      this.dataService.getUser(this.id).subscribe({
        next: (response) => {
          this.user=response;
          this.UserRole=response.role;
        },
        error: (error) => {
        },
      })
    }else{
      return
    }
    
  }
  
  logOut():void{
    this.dataService.logout();
  }
  openWindow(property: string, value: any):void{
    this.OpenWindow=true;
    this.inputValue=value;
    this.property=property;
    this.data={
      [property]:this.inputValue
    }    
  }

  
  openWindowForPassword():void{
    this.OpenWindowForPassword=true;
  }
  openWindowForEmail():void{
    this.OpenWindowForEmail=true;
  }

  passwordChange!:{};
  handlePasswordChange(event:any):void{
  const propertyName = event.target.name; 
  const propertyValue = event.target.value;
  this.passwordChange = { ...this.passwordChange, [propertyName]: propertyValue };
  }

  handleChange(event:any,property:string):void{
    this.inputValue = event.target.value;
    this.data[property]=this.inputValue 
  }
  removeWindow():void{
    this.OpenWindow=false;
    this.OpenWindowForPassword=false;
    this.property=''
  }
 

  updateUser():void{    
    this.dataService.editUser(this.data,this.user.id).subscribe({
      next: (response) => {
        this.user=response;
        window.location.reload();
      },
      error: (error) => {
        console.error('put request failed:', error);
      },
    })
  }
  changePassword():void{    
    this.dataService.changePassword(this.passwordChange,this.user.id).subscribe({
      next: (response) => {       
        window.location.reload();
      },
      error: (error) => {
        console.error('password change request failed:', error);
      },
    })
  }



  currentCode!:string;
  sendCodeToEmail():void{    
    this.dataService.sendEmailChangeCodeToEmail(this.data,this.user.id).subscribe({
      next: (response) => {       
        this.inputValue='';
        this.EnterCode=true;
        this.currentCode=response.randomeCode;        
      },
      error: (error) => {
        console.error('sending code to failed:', error);
      },
    })
  }

  codeData:any;
  enterCode():void{   
    this.codeData= {
      code:this.currentCode,
      newCode:this.data.email
    }
    this.dataService.enterEmailChangeCode(this.codeData,this.user.id).subscribe({
      next: (response) => {              
        this.inputValue='';
        this.EnterNewEmail=true;
      },
      error: (error) => {
        console.error('sending code to failed:', error);
      },
    })
  }

  emailData:any;
  email:any;
  enterNewEmail():void{   
    this.dataService.enterNewEmail(this.data,this.user.id).subscribe({
      next: (response) => {       
        this.currentCode=response.randomeCode;        
        this.inputValue='';
        this.EnterNewEmailCode=true;
        this.email=response.email
      },
      error: (error) => {
        console.error('sending code to failed:', error);
      },
    })
  }

  changeEmail():void{   
    this.codeData= {
      code:this.currentCode,
      newCode:this.data.email,
      email:this.email
    }
    this.dataService.changeEmail(this.codeData,this.user.id).subscribe({
      next: (response) => {       
        this.inputValue='';
        this.EnterNewEmailCode=true;
        window.location.reload();
      },
      error: (error) => {
        console.error('sending code to failed:', error);
        console.log(this.codeData);
      },
    })
  }

  public turnOn:boolean=false;

  toggleTwoFactored():void{
    this.turnOn=!this.turnOn;
    this.dataService.turnOnTwoStep(this.id).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error: (error) => {
        console.error('failed to turn on 2-factored', error);
      },
    })
  }
}
