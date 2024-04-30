import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { TranslateService } from '@ngx-translate/core';
import { log } from 'util';
import { User } from '../../shared/User.interface';

@Component({
  selector: 'app-edituserprofile',
  templateUrl: './edituserprofile.component.html',
  styleUrl: './edituserprofile.component.scss',
})
export class EdituserprofileComponent implements OnInit {
  @Input() doctorId!: string;
  @Input() role!: string;

  constructor(private dataService: DataService, private translate:TranslateService) {}
  id!: string;
  user!: User;
  OpenWindow = false;
  inputValue!: string;
  data!: any;
  property!: string;
  currentPassword!: string;
  newPassword!: string;
  OpenWindowForPassword = false;
  OpenWindowForEmail = false;
  EnterCode = false;
  EnterNewEmail = false;
  EnterNewEmailCode = false;
  public url = 'http://localhost:5134/Upload/Files/';
  Role = history.state.type;
  UserRole!: string;
  errorCode: string = '';
  errorPassword: string = '';
  errorEmail: string = '';
  error: string = '';
  isAdmin = false;
  receivedData!: number;

  ngOnInit(): void {
    this.dataService.book$.subscribe((data) => {
      this.receivedData = data;
    });

    const id = localStorage.getItem('id');
    if (id !== history.state.id) {
      this.isAdmin = true;
    }

    this.id = history.state.id;
    this.doctorId = history.state.id;
    
    if (this.id) {
      this.dataService.getUser(this.id).subscribe({
        next: (response) => {
          this.user = response;
          this.UserRole = response.role;
          this.role = response.role;                     
        },
        error: (error) => {},
      });
    } else {
      return;
    }

  }

  logOut(): void {
    this.dataService.logout();
  }
  openWindow(property: string, value: any): void {
    this.OpenWindow = true;
    this.inputValue = value;
    this.property = property;
    this.data = {
      [property]: this.inputValue,
    };
  }

  openWindowForPassword(): void {
    this.OpenWindowForPassword = true;
  }
  openWindowForEmail(): void {
    this.OpenWindowForEmail = true;
  }

  passwordChange!: {};
  handlePasswordChange(event: any): void {
    const propertyName = event.target.name;
    const propertyValue = event.target.value;
    this.passwordChange = {
      ...this.passwordChange,
      [propertyName]: propertyValue,
    };
  }

  handleChange(event: any, property: string): void {
    this.inputValue = event.target.value;
    this.data[property] = this.inputValue;
  }
  removeWindow(): void {
    this.OpenWindow = false;
    this.OpenWindowForPassword = false;
    this.property = '';
    this.EnterNewEmailCode=false;
    this.EnterNewEmail=false;
    this.EnterCode=false;
    this.error='',
    this.errorCode='',
    this.errorEmail='',
    this.errorPassword=''
  }

  updateUser(): void {
    this.dataService.editUser(this.data, this.user.id).subscribe({
      next: (response) => {
        this.user = response;
        window.location.reload();
      },
      error: (error) => {
        this.error = this.translate.instant('erroruccured');
      },
    });
  }
  changePassword(): void {
    this.dataService
      .changePassword(this.passwordChange, this.user.id)
      .subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          this.errorPassword =this.translate.instant('matchError');
        },
      });
  }

  currentCode!: string;
  sendCodeToEmail(): void {
    this.dataService
      .sendEmailChangeCodeToEmail(this.data, this.user.id)
      .subscribe({
        next: (response) => {
          this.inputValue = '';
          this.EnterCode = true;
          this.currentCode = response.randomeCode;
        },
        error: (error) => {
          this.errorEmail = this.translate.instant('errorEmail');

        },
      });
  }

  codeData: any;
  enterCode(): void {
    this.errorEmail = '';
    this.codeData = {
      code: this.currentCode,
      newCode: this.data.email,
    };

    this.dataService
      .enterEmailChangeCode(this.codeData, this.user.id)
      .subscribe({
        next: (response) => {
          if (this.codeData.newCode === this.codeData.code) {
            this.inputValue = '';
            this.errorCode = '';
            this.EnterNewEmail = true;
          } else {
            this.errorCode =this.translate.instant('errorCode');
          }
        },
        error: (error) => {
          this.errorCode = this.translate.instant('errorCode');
        },
      });
  }

  emailData: any;
  email: any;
  enterNewEmail(): void {
    this.errorEmail = '';
    this.errorCode = '';
    this.dataService.enterNewEmail(this.data, this.user.id).subscribe({
      next: (response) => {
        this.currentCode = response.randomeCode;
        this.inputValue = '';
        this.EnterNewEmailCode = true;
        this.email = response.email;
      },
      error: (error) => {
        this.errorEmail =this.translate.instant('errorEmail');
      },
    });
  }

  changeEmail(): void {
    this.errorCode = '';
    this.errorEmail = '';
    this.error = '';
    this.codeData = {
      code: this.currentCode,
      newCode: this.data.email,
      email: this.email,
    };
    this.dataService.changeEmail(this.codeData, this.user.id).subscribe({
      next: (response) => {
        this.inputValue = '';
        this.EnterNewEmailCode = true;
        window.location.reload();
      },
      error: (error) => {
        this.error = this.translate.instant('erroruccured');
      },
    });
  }


  toggleTwoFactored(): void {
    this.user.twoFactorEnabled=!this.user?.twoFactorEnabled
    this.dataService.turnOnTwoStep(this.id).subscribe({
      next: (response) => {     
        window.location.reload()           
      },
      error: (error) => {
      },
    });
  }
}
