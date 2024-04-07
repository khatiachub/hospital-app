import { Component, OnInit } from '@angular/core';
import { DataService } from './core/data-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'hospital-app';

  constructor(private dataService: DataService,private router: Router,private titleService:Title) {
    this.titleService.setTitle($localize `${this.title}`)
  }
  showCategories: boolean = true; 
  public open:boolean=false;

  ngOnInit(): void {
    this.dataService.data$.subscribe(data => {
      this.open = data;
    });
    
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.url.split('/'); 
      const adminPanelPath = url.find(segment => segment === 'admin-panel') 
      const edituser = url.find(segment => segment === 'edituser')           
       if(event.url==='/registration'||adminPanelPath||event.url==='/grids'||edituser){
        this.showCategories=false
       }else{
        this.showCategories=true;        
       }       
    });
  }

  removeLoginForm():void{
    this.open=false
  }
}
