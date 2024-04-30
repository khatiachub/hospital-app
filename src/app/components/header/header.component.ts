import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { User } from '../../shared/User.interface';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { log } from 'console';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    public dataService: DataService,
    private router: Router,
    private translate: TranslateService,
  ) {
  }
  public data: boolean = false;
  public admin!: string;
  public SearchByName!: string;
  public SearchByLastName!: string;
  public SearchByCategory!: string;
  public search!: any;
  public user!: User;
  public Doctors: User[] = [];
  public Categories: User[] = [];
  public matchedDoctors: User[] = [];
  public Token!: string | null;
  public url = 'http://localhost:5134/Upload/Files/';
  public language = true;
  lang!: string | null;
  id!: string|null;
  isAuthenticated:boolean = false;
  selected: any = '';
  homepath!: string | undefined;
  switchLanguage(event: any) {    
    if (event === 'ka') {
      this.selected = 'en';
    } else {
      this.selected = 'ka';
    }
    localStorage.setItem('event', this.selected);
    this.translate.use(this.selected);
    this.dataService.setLanguage(this.selected);
  }

  Authorize(): void {
    this.data = true;
    this.dataService.updateData(this.data);
  }
  goToProfile(id: string): void {
    this.router.navigate([`/edituser/${id}`], { state: { id: id } });
  }
  goToAdminPanel(id: string): void {
    this.router.navigate([`/admin-panel/${id}`]);
  }



  ngOnInit(): void {

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.url.split('/');
        this.homepath = url.find((segment) => segment === 'home');
      });

    
    this.lang = localStorage.getItem('event');
    if (!this.lang) {
      this.selected = 'ka'; 
      localStorage.setItem('lang', this.selected);
    } else {
      this.selected = this.lang; 
    }
    this.translate.use(this.selected);
    this.dataService.setLanguage(this.selected);
 

    if (typeof localStorage !== 'undefined' && localStorage.getItem('id')) {
      this.id = localStorage.getItem('id') || null;
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      this.Token = localStorage.getItem('token') || null;
    }

    if (this.Token&& this.id) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
    

    if (this.isAuthenticated) {
      this.dataService.getUser(this.id).subscribe((data) => {
        this.user = data;
        if (data.role === 'ADMIN') {
          this.admin = 'ადმინისტრატორი';
        }
      });
    } else {
      return;
    }
  }

  handleChange(event: any): void {
    const propertyName = event.target.name;
    const propertyValue = event.target.value;
    this.search = { ...this.search, [propertyName]: propertyValue };
  }

  clickOverlay(): void {
    this.setOverlay = false;
  }
  public names!: any[];
  category!: string;
  setOverlay = false;
  role!: string;
  filteredUsers = [];
  handleClick(): void {
    this.router.navigate(['/home']);
    if (this.search.name && !this.search.category) {
      this.names = this.search.name?.split(' ');
      this.SearchByName = this.names[0];
      this.SearchByLastName = this.names.slice(1).join(' ');

      this.dataService
        .getDoctorsByName(this.SearchByName, this.SearchByLastName)
        .subscribe({
          next: (response) => {
            this.Doctors = response.filter(
              (user: any) => user.role === 'DOCTOR'
            );
            this.filteredUsers = response.filter(
              (user: any) =>
                user.role !== 'DOCTOR' ||
                (user.name !== this.SearchByName &&
                  user.lastName !== this.SearchByLastName)
            );
            if (
              (response.length === 0 || this.filteredUsers.length > 0) &&
              this.Doctors.length === 0
            ) {
              this.setOverlay = true;
            }
            if (this.Doctors) {
              this.dataService.setDoctorsData(this.Doctors);
            }
            this.names = [];
            this.search.name = false;
          },
          error: (error) => {
            this.setOverlay = true;
          },
        });
    } else if (this.search.category && !this.search.name) {
      this.dataService.getDoctorsByCategory(this.search.category).subscribe({
        next: (response) => {
          this.Categories = response;

          if (response.length === 0) {
            this.setOverlay = true;
          }
          if (this.Categories) {
            this.dataService.setDoctorsData(this.Categories);
          }
        },
        error: (error) => {
          this.setOverlay = true;
        },
      });
    } else if (this.search.category && this.search.name) {
      this.names = this.search.name?.split(' ');
      this.category = this.search.category;
      this.SearchByName = this.names[0];
      this.SearchByLastName = this.names.slice(1).join(' ');
      this.dataService
        .getDoctorsByName(this.SearchByName, this.SearchByLastName)
        .subscribe((nameData) => {
          this.dataService
            .getDoctorsByCategory(this.search.category)
            .subscribe((categoryData) => {
              this.matchedDoctors = nameData.filter((nameDoctor: User) => {
                return categoryData.some((categoryDoctor: User) => {
                  return (
                    nameDoctor.name === categoryDoctor.name &&
                    nameDoctor.lastName === categoryDoctor.lastName &&
                    nameDoctor.category === categoryDoctor.category
                  );
                });
              });
              if (this.matchedDoctors.length > 0) {
                this.dataService.setDoctorsData(this.matchedDoctors);
                this.names = [];
                this.category = '';
                this.search.name = false;
              } else {
                this.names = [];
                this.category = '';
                this.setOverlay = true;
                this.search.name = false;
              }
            });
        });
    }
  }
}
