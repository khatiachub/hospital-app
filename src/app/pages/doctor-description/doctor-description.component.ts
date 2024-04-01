import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/User.interface';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-doctor-description',
  templateUrl: './doctor-description.component.html',
  styleUrl: './doctor-description.component.scss'
})
export class DoctorDescriptionComponent implements OnInit {
  public currentPath: string;
  constructor(private dataService: DataService,private router: Router) {this.currentPath = this.router.url}

  public doctor!:User;
  public url='http://localhost:5134/Upload/Files/'
  ngOnInit(): void {
    const parts = this.currentPath.split('/');
    const id = parts[parts.length - 1];    
    // console.log(id);

    this.dataService.getDoctor(id).subscribe((data) => {
      console.log(data);
      console.log(data?.profileImage);
      
      this.doctor=data
    });
  }
}
