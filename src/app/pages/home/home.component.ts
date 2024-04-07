import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(private dataService: DataService,private router:Router) {}

  public url='http://localhost:5134/Upload/Files/'
  public allDoctors:any;
ngOnInit(): void {
  this.dataService.getAllDoctors().subscribe({
    next: (response) => {
      this.allDoctors=response;  
      console.log(this.allDoctors);
          
    },
    error: (error) => {
      console.error('GET request failed:', error);
    },
  });
  this.dataService.doctorsData$.subscribe(data => {
    if(data.length>0){
      this.allDoctors = data;
    }    
  });
}
clickOnCard(Id:string):void{
  this.router.navigate([`doctor/${Id}`]);
}
}
