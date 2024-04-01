import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form = new FormGroup({
    Email: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
  });
  constructor(private dataService:DataService,private router: Router) {}
  handleButtonClick(event: MouseEvent): void {
    event.stopPropagation();
}


  Login():void{ 
    const data = this.form.value;        
    if (this.form.valid) {
      this.dataService.login(data).subscribe({
        next: (response) => {
          console.log('POST request successful:', response);
          console.log(response.id);
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.id);
          this.router.navigate(['home']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('POST request failed:', error);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  } 

}
