import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { Router } from '@angular/router';


DataService
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  constructor(private dataService: DataService,private router:Router) {}
  public data:boolean=false;
  public admin!:string;
  Authorize():void{
    this.data=true;    
    this.dataService.updateData(this.data);
  }
  goToProfile(id:string):void{
    this.router.navigate([`/user/${id}`])    
  }
  goToAdminPanel(id:string):void{
    this.router.navigate([`/admin-panel/${id}`])    
  }

  public user!:User;
  id:any;
  ngOnInit(): void {
    if(typeof localStorage !== 'undefined' &&localStorage.getItem('id')){
      this.id = localStorage.getItem('id')||null;
    }
      this.dataService.getUser(this.id).subscribe((data) => {
        this.user=data  
        if(data.role==='ADMIN'){
          this.admin='ადმინისტრატორი'
        }      
      });   
  }
}
