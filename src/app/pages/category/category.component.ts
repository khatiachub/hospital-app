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
  categoryResponse: any;
  public category:any;
  public allDoctors:any;
  constructor(private dataService: DataService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];      
    });
   
    this.dataService.getDoctorsByCategory(this.category).subscribe({
      next: (response) => {
        this.categoryResponse=response;
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
