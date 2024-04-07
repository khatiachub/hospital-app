import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';
import { Category } from '../../shared/Category.interface';
import { error } from 'console';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})

export class CategoriesComponent implements OnInit {
  constructor(private router:Router,private readonly dataService:DataService) {}
  public cat:Category[]=[];
  showAllElements: boolean = false;
  public categories:any;
ngOnInit(): void {
  this.dataService.getCategories().subscribe((response) => {
    this.cat=response;
    this.cat.map((cat)=>(
      this.dataService.getDoctorsByCategory(cat.category).subscribe({
        next:(response)=>{
          cat.quantity=response.length
        },
        error:(error)=>{
          console.log(error);
        }
       })
    ))
  });
  
}

toggleShowAll(): void {
  this.showAllElements = !this.showAllElements;
}
getCategory(category:string):void{
    const encodedCategory = encodeURIComponent(category);
    this.router.navigate(['/doctors',encodedCategory],{ state: { category:category } }).then(() => {
      window.location.reload();
    });
  }
}
