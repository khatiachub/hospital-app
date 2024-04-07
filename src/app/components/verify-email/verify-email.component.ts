import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  constructor(private dataService: DataService,private route:ActivatedRoute,private router:Router) {}
  public errorMessage=''
  public data!:any;
  public email:any;
  public token:any;
  ngOnInit(): void {
    const paramsValue = this.getParamsValue();
    this.token = paramsValue.Token;
    this.email = paramsValue.Email;
  
    this.dataService.verifyEmail(this.token,this.email).subscribe({
      next: (response) => {
       localStorage.setItem('token', response.jwtToken);
       localStorage.setItem('id', response.user.id);
       this.router.navigate([`edituser/${response.user.id}`],{state:{id:response.user.id}}).then(() => {
         window.location.reload();
       }); 
      },
      error: (error) => {
        console.error('GET request failed:', error);
        this.errorMessage='ბმულის მოქმედების ვადა ამოიწურა'
      },
    }); 
    
    
    
  }
  private getParamsValue(): { Token: string, Email: string } {
    const params = this.route.snapshot.paramMap;
    const token = params.get('Token') || '';
    const email = params.get('Email') || '';
    return { Token: token, Email: email };
  }


}
