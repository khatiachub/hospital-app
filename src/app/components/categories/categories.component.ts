import { Component, OnInit } from '@angular/core';
import { categories } from '../../shared/categories.data';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  constructor(private userService:DataService,private router:Router) {}

  public cat=categories;
  getCategory(category:string):void{
    this.router.navigate([`/doctors/${category}`],{ queryParams: { category: category } }).then(() => {
      window.location.reload();
    });
  }
}
