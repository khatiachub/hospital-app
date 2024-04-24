import { Component, Input, OnInit } from '@angular/core';
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
  @Input() doctorId!: string;
  constructor(private dataService: DataService,private router: Router) {this.currentPath = this.router.url}

  public doctor!:User;
  public url='http://localhost:5134/Upload/Files/'
  ngOnInit(): void {
    const parts = this.currentPath.split('/');
    const id = parts[parts.length - 1];    

    this.dataService.getDoctor(id).subscribe((data) => {
      this.doctorId=data.id;
      this.doctor=data
      console.log(data);
      
    });
  }
}
