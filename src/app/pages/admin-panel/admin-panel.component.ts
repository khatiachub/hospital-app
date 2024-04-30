import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/data-service.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {
  constructor(
    private userService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  public id!: string;
  public authResponse!: boolean;

  goToGrid(params: string): void {    
    this.router.navigate(['/grids'], { state: { params } });
  }
  logOut(): void {
    this.userService.logout();
  }
}
