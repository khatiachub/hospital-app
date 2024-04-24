import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  
  constructor(public dataService: DataService,private router:Router,private translate: TranslateService,private cdr: ChangeDetectorRef) {translate.setDefaultLang('en')}
  public data:boolean=false;
  public admin!:string;
  public SearchByName!:string;
  public SearchByLastName!:string;
  public SearchByCategory!:string;
  public search!:any;
  public user!:User;
  public Doctors:User[]=[]
  public Categories:User[]=[]
  public matchedDoctors:User[]=[]
  public Token!:string|null;
  public url='http://localhost:5134/Upload/Files/'
  public language=true;
  lang!:string|null;
  selectedEN='';
  switchLanguage(event: any) {
    if(event==='ka'){
      this.selected='en'
    }else{
      this.selected='ka'
    }
    localStorage.setItem('event', this.selected);
    window.location.reload();
}

  Authorize():void{
    this.data=true;    
    this.dataService.updateData(this.data);
  }
  goToProfile(id:string):void{
    this.router.navigate([`/edituser/${id}`],{state:{id:id}})    
  }
  goToAdminPanel(id:string):void{
    this.router.navigate([`/admin-panel/${id}`])    
  }

  id:any;
  isAuthenticated=false;
  selected:any='';
  homepath!:string | undefined;
 
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {      
      const url = event.url.split('/'); 
      this.homepath= url.find(segment => segment === 'home') 
    });
      this.selected = localStorage.getItem('event');
      this.translate.use( this.selected);
      this.dataService.setLanguage( this.selected);

  
    if(typeof localStorage !== 'undefined' &&localStorage.getItem('id')){
      this.id = localStorage.getItem('id')||null;
    }
    if(typeof localStorage !== 'undefined' &&localStorage.getItem('token')){
      this.Token = localStorage.getItem('token')||null;
    }
   
    if(this.Token!=='undefined'&&this.id!=='undefined'){
      this.isAuthenticated=true;
    }else{
      this.isAuthenticated=false;
    }

    if(this.isAuthenticated){
      this.dataService.getUser(this.id).subscribe((data) => {        
        this.user=data  
        if(data.role==='ADMIN'){
          this.admin='ადმინისტრატორი'
        }      
      });   
    }else{
      return
    }

    if(localStorage!==undefined){
     this.lang=localStorage.getItem('lang');
    }
    
    
    const savedLanguage = this.dataService.getLanguage(this.lang);
    if (savedLanguage) {
      this.translate.use(savedLanguage);
    } else {
    }
  }

  handleChange(event:any):void{
    const propertyName = event.target.name; 
    const propertyValue = event.target.value;
    this.search= {...this.search,[propertyName]: propertyValue};            
  }

  public names!:any;
  handleClick():void{
    this.router.navigate(['/home'])

    if(this.search.name&&!this.search.category){
      console.log(this.search.name);
      
      this.names=this.search.name?.split(' ')
      this.SearchByName=this.names[0];
      this.SearchByLastName=this.names.slice(1).join(' ');
      this.dataService.getDoctorsByName(this.SearchByName,this.SearchByLastName).subscribe((data) => {
      this.Doctors=data  
      if (this.Doctors) {
        this.dataService.setDoctorsData(this.Doctors);
      }
    });  
    }else if(this.search.category&&this.search.name===''){
       this.dataService.getDoctorsByCategory(this.search.category).subscribe((data) => {
        this.Categories=data  
        if (this.Categories) {
          this.dataService.setDoctorsData(this.Categories);          
        }
      });  
    }else if(this.search.category&&this.search.name){
      this.names=this.search.name?.split(' ')
      this.SearchByName=this.names[0];
      this.SearchByLastName=this.names.slice(1).join(' ');
      this.dataService.getDoctorsByName(this.SearchByName, this.SearchByLastName).subscribe((nameData) => {
        this.dataService.getDoctorsByCategory(this.search.category).subscribe((categoryData) => {
            this.matchedDoctors = nameData.filter((nameDoctor:User) => {
                return categoryData.some((categoryDoctor:User )=> {
                    return nameDoctor.name === categoryDoctor.name&&nameDoctor.lastName === categoryDoctor.lastName && nameDoctor.category === categoryDoctor.category;
                });
            });
            if (this.matchedDoctors) {
              this.dataService.setDoctorsData(this.matchedDoctors);
            }
        });
    }); 
  } 
}
}
