import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data-service.service';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {

  constructor(private userService:DataService,private router:Router,private route:ActivatedRoute) {}
  public id!:string;
  public authResponse!:boolean;
  public turnOn!:boolean;



  goToGrid(params:string):void{
    this.router.navigate(['/grids'],{state:{params}})    
  }
  logOut():void{
    this.userService.logout();
  }
  
  
  toggleTwoFactored(): void {
    this.turnOn = !this.turnOn;
    this.route.params.subscribe(params => {
      this.id = params['id']; 
    });    
    this.userService.turnOnTwoStep(this.id).subscribe({
      next: (response) => {
        console.log(response);
        this.authResponse = response.result;
        localStorage.setItem('twoFactorAuth', response.result); 
      },
      error: (error) => {
        console.error('Failed to turn on 2-factored', error);
      },
    })
  }
  
  ngOnInit() {
    const authStatus = localStorage.getItem('twoFactorAuth');    
    if (authStatus==='two step authorization is on') {
      this.turnOn = true;
    } else {
      this.turnOn=false;
    }
  }
  
}

