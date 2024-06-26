import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {}
  private url = 'http://localhost:5134/api';

  registration(data: any): Observable<any> {
    return this.http.post(`${this.url}/register`, data);
  }
  registerDoctorAndAdmin(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/AddUsersByRoles`, formData);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.url}/login`, data);
  }

  getUser(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.url}/user/${id}`);
  }
  editUser(data: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/EditUser/${id}`, data);
  }
  changePassword(data: any, id: string): Observable<any> {
    return this.http.post<any>(`${this.url}/ChangePassword/${id}`, data);
  }
  //categories
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetCategory`);
  }
  editCategory(data: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.url}/EditCategory/${id}`, data);
  }
  addCategory(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/AddCategory/`, data);
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/DeleteCategory/${id}`);
  }

  //email change
  sendEmailChangeCodeToEmail(data: any, id: string): Observable<any> {
    return this.http.post<any>(
      `${this.url}/sendemailchangecodetoemail/${id}`,
      data
    );
  }
  enterEmailChangeCode(data: any, id: string): Observable<any> {
    return this.http.post<any>(`${this.url}/enteremailchangecode/${id}`, data);
  }
  enterNewEmail(data: any, id: string): Observable<any> {
    return this.http.post<any>(`${this.url}/enternewemail/${id}`, data);
  }
  changeEmail(data: any, id: string): Observable<any> {
    return this.http.post<any>(`${this.url}/changeemail/${id}`, data);
  }

  getDoctorsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetByCategory/${category}`);
  }
  getDoctorsByName(name: string, lastname: string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetByName/${name}/${lastname}`);
  }
  getByRoles(role: string): Observable<any> {
    return this.http.get<any>(`${this.url}/GetByRoles/${role}`);
  }
  deleteUser(id: string): Observable<any> {
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
  getDoctor(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/doctor/${id}`);
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('id');
      window.localStorage.removeItem('role')
    } else {
    }
    this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }

  private doctorsDataSubject = new BehaviorSubject<any[]>([]);
  doctorsData$: Observable<any[]> = this.doctorsDataSubject.asObservable();
  setDoctorsData(data: any[]): void {
    this.doctorsDataSubject.next(data);
  }

  turnOnTwoStep(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.url}/2-step-authorization/${id}`);
  }

  enterCode(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/Auth-Code`, data);
  }

  //recover password
  sendEmail(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/recoverpassword`, data);
  }
  sendResetCode(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/enter-password-recovery-code`,
      data
    );
  }
  enterNewPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/enter-new-password`, data);
  }
  verifyEmail(token: string, email: string): Observable<any> {
    return this.http.get<any>(`${this.url}/VerifyEmail/${token}/${email}`);
  }
  //download files
  downloadFile(filename: string): Observable<Blob> {
    const url = `${this.url}/DownloadFile/${filename}`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  setLanguage(language: string) {
    if (localStorage != undefined) {
      window.localStorage.setItem('lang', language);
    }
  }

  getLanguage(language: string | null): string | null {
    return language;
  }

  //add events
  addEvent(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/AddEvent`, data);
  }
  getEvent(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetEvent`);
  }
  editEvent(data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/EditEvent/${data.id}`, data);
  }
  // deleteEvent(id:number): Observable<any> {
  //   return this.http.delete<any>(`${this.url}/DeleteEvent/${id}`);
  // }

  addEventForEvent(data: any, id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/${id}/Events`, data);
  }
  getEventForEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}/Events`);
  }
  editEventForEvent(
    data: any,
    calendarId: number,
    eventId: number
  ): Observable<any> {
    return this.http.put<any>(
      `${this.url}/${calendarId}/Events/${eventId}`,
      data
    );
  }
  deleteEventForEvent(calendarId: number, eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${calendarId}/Events/${eventId}`);
  }

  private bookData = new BehaviorSubject<number>(0);
  book$: Observable<number> = this.bookData.asObservable();

  updateBook(data: number) {
    this.bookData.next(data);
  }

  //selected day
  addSelectedDay(data: any): Observable<any> {
    return this.http.post<any>(`${this.url}/SelectedDay`, data);
  }
  getSeletedDay(): Observable<any> {
    return this.http.get<any>(`${this.url}/SelectedDay`);
  }

  deleteSeletedDay(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/DeleteSelectedDay/${id}`);
  }
}
