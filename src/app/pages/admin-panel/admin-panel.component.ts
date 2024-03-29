import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../core/data-service.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
  constructor(private userService:DataService) {}

  logOut():void{
    this.userService.logout();
  }
}
