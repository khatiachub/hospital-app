import { Component, OnInit } from '@angular/core';
import { DataService } from './core/data-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'hospital-app';

  constructor(private dataService: DataService,private router: Router) {}
  showCategories: boolean = true; 
  public open:boolean=false;

  ngOnInit(): void {
    this.dataService.data$.subscribe(data => {
      this.open = data;
    });
    
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments = event.url.split('/'); 
      const adminPanelPath = urlSegments.find(segment => segment === 'admin-panel') 
      const url = event.url.split('/'); 
      const edituser = url.find(segment => segment === 'edituser')           
       if(event.url==='/registration'||adminPanelPath||event.url==='/users-grid'||edituser){
        this.showCategories=false
       }else{
        this.showCategories=true;
        console.log(event.url);
        
       }       
    });
  }

  removeLoginForm():void{
    this.open=false
  }
}
