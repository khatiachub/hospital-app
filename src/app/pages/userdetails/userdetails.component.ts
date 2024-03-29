import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.scss'
})


export class UserdetailsComponent implements OnInit {
  constructor(private userService:DataService) {}
  role!:string;
  public user!:User;
  id!:string|null;
  ngOnInit(): void {
    if(typeof localStorage !== 'undefined' &&localStorage.getItem('id')){
      this.id = localStorage.getItem('id')||null;
    }
    this.userService.getUser(this.id).subscribe((data) => {
      console.log(data);
      this.user=data
      if(this.user.role==='DOCTOR'){
        this.role='ექიმი'
      }else{
        this.role='მომხმარებელი'
      }
    });
  }

  logOut():void{
    this.userService.logout();
  }
}
