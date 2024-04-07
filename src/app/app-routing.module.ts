import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { DoctorDescriptionComponent } from './pages/doctor-description/doctor-description.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { UsersGridComponent } from './pages/users-grid/users-grid.component';
import { EdituserprofileComponent } from './pages/edituserprofile/edituserprofile.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  {path:'doctors/:category',component:CategoryComponent},
  {path:'home',component:HomeComponent},
  {path: '*/*', redirectTo: '/home', pathMatch: 'full'},
  {path:"registration",component:RegistrationComponent},
  {path:"doctor/:id",component:DoctorDescriptionComponent},
  {path:"admin-panel/:id",component:AdminPanelComponent},
  {path:"grids",component:UsersGridComponent},
  {path:"edituser/:id",component:EdituserprofileComponent},
  {path:"api/VerifyEmail/:Token/:Email",component:VerifyEmailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
