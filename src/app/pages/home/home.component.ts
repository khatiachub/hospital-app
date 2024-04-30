import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/data-service.service';
import { Router } from '@angular/router';
import { User } from '../../shared/User.interface';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router) {}
  public url = 'http://localhost:5134/Upload/Files/';
  public allDoctors: User[] = [];
  pinned:boolean=false;
  ngOnInit(): void {
    this.dataService.getAllDoctors().subscribe({
      next: (response) => {
        this.allDoctors = response;        
      },
      error: (error) => {
        console.error('GET request failed:', error);
      },
    });
    this.dataService.doctorsData$.subscribe((data) => {
      if (data.length > 0) {
        this.allDoctors = data;
      }
    });
   
    const usersJSON = localStorage.getItem('pinned') as string;
    if (usersJSON) {
      this.allDoctors = JSON.parse(usersJSON);
    }    
  }
  clickOnCard(Id: string): void {
    this.router.navigate([`doctor/${Id}`]);
  }

  pinnedCards: User[] = [];
  unpinnedCards: User[] = [];
  pinCard(id: string): void {
    this.pinned=true;
    const category = this.allDoctors.find(
      (category: { id: string }) => category.id === id
    );
    if (category) {
      category.pinned = true;
    }
    this.allDoctors.find((category: { id: string }) => category.id === id);
    this.pinnedCards = this.allDoctors.filter(
      (category: { pinned: any }) => category.pinned
    );
    this.unpinnedCards = this.allDoctors.filter(
      (category: { pinned: any }) => !category.pinned
    );
    const pinned = this.pinnedCards.concat(this.unpinnedCards);
    this.allDoctors = pinned;
    const pinnedcards = JSON.stringify(this.allDoctors);
    localStorage.setItem('pinned', pinnedcards);
  }
  unpinCard(id: string): void {
    const category = this.allDoctors.find(
      (category: { id: string }) => category.id === id
    );
    if (category) {
      category.pinned = false;
    }
    localStorage.removeItem('pinned');
  }
}
