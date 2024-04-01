import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categoryResponse:User[]=[];
  public category:any;
  public allDoctors:any;
  public url='http://localhost:5134/Upload/Files/'

  constructor(private dataService: DataService,private router:Router) {}

  ngOnInit(): void {
    this.category = history.state.category;
   
    this.dataService.getDoctorsByCategory(this.category).subscribe({
      next: (response) => {
        JSON.stringify(response)
        this.categoryResponse=response;
        console.log(this.categoryResponse);
        console.log(response);
      },
      error: (error) => {
        console.error('GET request failed:', error);
      },
    });     
  }

  public doctor!:User;
  clickOnCard(Id:string):void{
    this.router.navigate([`doctor/${Id}`]);
  }
}
