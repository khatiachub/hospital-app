import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  constructor(private router:Router,private readonly dataService:DataService) {}
  public cat:any;
ngOnInit(): void {
  this.dataService.getCategories().subscribe((response) => {
    this.cat=response;
  });
}

  getCategory(category:string):void{
    const encodedCategory = encodeURIComponent(category);
    this.router.navigate(['/doctors',encodedCategory],{ state: { category:category } }).then(() => {
      window.location.reload();
    });
  }
}
