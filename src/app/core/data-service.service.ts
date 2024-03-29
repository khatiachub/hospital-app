import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient,private router:Router) { }
  private url="http://localhost:5134/api"
 
  register(data: any): Observable<any> {
    return this.http.post(`${this.url}/register`, data,
    );
  }
  registerDoctorAndAdmin(data: any): Observable<any> {
    return this.http.post(`${this.url}/AddUsersByRoles`, data,
    );
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.url}/login`, data,
    );
  }

  getUser(id:string|null): Observable<any> {
      return this.http.get<any>(`${this.url}/user/${id}`);
  }
  editUser(data:any,id:string): Observable<any> {
    return this.http.put<any>(`${this.url}/EditUser/${id}`,data);
  }
  changePassword(data:any,id:string): Observable<any> {
  return this.http.post<any>(`${this.url}/ChangePassword/${id}`,data);
  }

  //email change
  sendEmailChangeCodeToEmail(data:any,id:string): Observable<any> {
  return this.http.post<any>(`${this.url}/sendemailchangecodetoemail/${id}`,data);
  }
  enterEmailChangeCode(data:any,id:string): Observable<any> {
    return this.http.post<any>(`${this.url}/enteremailchangecode/${id}`,data);
 }
 enterNewEmail(data:any,id:string): Observable<any> {
  return this.http.post<any>(`${this.url}/enternewemail/${id}`,data);
  }
  changeEmail(data:any,id:string): Observable<any> {
    return this.http.post<any>(`${this.url}/changeemail/${id}`,data);
  }









  getDoctorsByCategory(category:string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetByCategory/${category}`);
  }
  getByRoles(role:string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetByRoles/${role}`);
  }
  deleteUser(id:string): Observable<any> {
    return this.http.delete<any>(`${this.url}/user/${id}`);
  }
  getAllDoctors(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetAllDoctors`);
  }
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetAllUsers`);
  }

  private dataSubject = new BehaviorSubject<boolean>(false);
  data$: Observable<boolean> = this.dataSubject.asObservable();

  updateData(newValue: boolean): void {
    this.dataSubject.next(newValue);
  }
  getDoctor(id:string): Observable<any> {
    return this.http.get<any>(`${this.url}/doctor/${id}`);
  }



  // Method to perform logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.router.navigate(['/'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }
  isAuthenticated(): boolean {
    if(typeof localStorage !== 'undefined' &&localStorage.getItem('token')){
      return true
    }
    return false; 
  }
}



  