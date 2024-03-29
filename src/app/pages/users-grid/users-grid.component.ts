import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { Router } from '@angular/router';



@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrl: './users-grid.component.scss'
})
export class UsersGridComponent implements OnInit {
  constructor(private dataService: DataService,private router:Router) {}
  users:User[]=[];
  isOpen:boolean=false;
  types=["მომხმარებელი","ადმინისტრატორი","ექიმი"];

  role='USER'
  ngOnInit(): void {
    this.dataService.getByRoles(this.role).subscribe({
      next: (response) => {
        this.users=response;
        console.log(this.users);
      },
      error: (error) => {
        console.error('GET request failed:', error);
      },
    }); 
  }

  addUser():void{
    this.isOpen=true    
  }
  removeOverlay():void{
    this.isOpen=false
  }
  navigateToRegister(type:string):void{
    this.router.navigate(['/registration'],{ state: { type: type } });
  }

  delete=false;
  userId!:string;
  showDeleteWindow(id:string):void{
    this.delete=true;
    this.userId=id;
  }
  removeWindow():void{
    this.delete=false;
  }
  deleteUser():void{
    this.dataService.deleteUser(this.userId).subscribe(() => {
      console.log('user deleted successfully');
      window.location.reload();
    });
  }
  editUser(id:string):void{
    this.router.navigate([`/edituser/${id}`],{state:{id:id}})
  }
  
}
