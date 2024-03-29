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


  public allDoctors:any;

ngOnInit(): void {
  this.dataService.getAllDoctors().subscribe({
    next: (response) => {
      this.allDoctors=response;      
    },
    error: (error) => {
      console.error('GET request failed:', error);
    },
  });
}
clickOnCard(Id:string):void{
  this.router.navigate([`doctor/${Id}`]);
}
}
