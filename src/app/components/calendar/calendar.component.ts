import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { Subject } from 'rxjs';
import {
  Calendar,
  ChildEvent,
  EditCalendarEvent,
  EditEvent,
  User,
} from '../../shared/User.interface';
import moment from 'moment';
import {
  CalendarEvent,
  CalendarDateFormatter,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { EventColor, WeekDay } from 'calendar-utils';
import { DataService } from '../../core/data-service.service';
import { TranslateService } from '@ngx-translate/core';
moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0,
  },
});

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  day: any;
  editdescription!: string;
  description!: string;
  dateStart: string = '';
  dateEnd: string = '';
  isBooked: boolean = false;
  isOpen: boolean = false;
  events: CalendarEvent[] = [];
  editUser: boolean = false;
  DoctorId!: string;
  UserId!: string;
  BookQuantity!: number;
  OpenDateInput: boolean = false;
  EditEnabled: boolean = false;
  Editable: boolean = false;
  isAdmin: boolean = false;
  DeleteEnabled: boolean = false;
  ChildEvents: ChildEvent[] = [];
  PlaceEvents: any[] = [];
  filteredBooks: Calendar[] = [];
  books!: number;
  booksForDoctor: Calendar[] = [];
  DoctorBooks: ChildEvent[] = [];
  SumUserBooks!: number;
  SumDoctorBooks!: number;
  FilteredUsers: any[] = [];
  isUserEntered: boolean = false;
  isDoctorEntered: boolean = false;
  isEventDeleted: boolean = false;
  userId: string[] = [];
  userEntered!: boolean;
  userType!: boolean;
  @Input() doctorId!: string;
  @Input() role!: string;
  public url = 'http://localhost:5134/Upload/Files/';
  selectedDays: Date[] = [];
  isHoliday = false;
  unBooked!:ChildEvent;
  deleteOnClick:boolean=false;
  id:string|null = localStorage.getItem('id');

  constructor(
    private dataService: DataService,
    public customDateFormatter: CustomDateFormatter,
    private translate: TranslateService,
  ) {}
  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  refresh = new Subject<void>();
  date = new Date();

  isWeekend(date: Date): boolean {
    if (!date) {
      return false;
    }
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  typeSubscription!: any;

  dayClicked(day: WeekDay): void {    
    if(this.isAdmin){
      const clickedDate = new Date(
        day.date.getTime() - day.date.getTimezoneOffset() * 60000
      );
  
      const date = clickedDate.toISOString();
      const data = {
        selectedDate: date,
      };
  
      this.dataService.addSelectedDay(data).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
        },
      });
    }else{      
      return
    }
  }

  checkHolidays(): void {
    this.isHoliday = true;
  }

  isSelected(day: any): boolean {
    const clickedDate = new Date(day);
    clickedDate.setHours(0, 0, 0, 0);
    const isDaySelected = this.selectedDays.some((selectedDay) =>
      this.areDatesEqual(selectedDay, clickedDate)
    );
    return isDaySelected;
  }

  areDatesEqual(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  selected!: Date;
  selectedDates: any = [];

  deleteSelectedDay(id: number): void {
    this.dataService.deleteSeletedDay(id).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {},
    });
  }

  ngOnInit(): void {       
    this.dataService.getSeletedDay().subscribe({
      next: (response) => {
        this.selectedDates = response;
        response.forEach((dateStr: any) => {
          const selectedDate = new Date(dateStr.selectedDate);
          selectedDate.setHours(0, 0, 0, 0);
          this.selectedDays.push(selectedDate);
        });
      },
      error: (error) => {
      },
    });

    const currentUrl = window.location.href;
    if (currentUrl.includes('edituser')) {
      this.editUser = true;
    }
    if (localStorage.getItem('role') === 'ADMIN') {
      this.isAdmin = true;
    }

    this.dataService.getEvent().subscribe({
      next: (response) => {
        this.events = response.$values;
        const filtered = response.$values.filter(
          (event: Calendar) => this.isBooked && event.doctorId === this.doctorId
        );
        filtered.forEach(
          (event: any) => (this.booksForDoctor = event.Events.$values.length)
        );

        response.$values.forEach((response: any) => {
          const start = new Date(response.start);
          const end = new Date(response.endDate);
          response.start = start;
          response.end = end;
          
          const filteredEvents = response.Events.$values.filter(
            (event: ChildEvent) => event.isBooked === false
          );
          const filteredMyEvents = response.Events.$values.filter(
            (event: ChildEvent) => event.userId === this.doctorId
          );
          this.BookQuantity = filteredEvents.length;

          this.books = filteredMyEvents.length;

          response.title =
            !this.editUser && this.BookQuantity > 0
              ? `${this.translate.instant('bookedSpaces')} ${
                  this.BookQuantity
                } ${this.translate.instant('space')}`
              : (response.isBooked && this.role === 'USER' && this.editUser) ||
                this.id === response.userId
              ? `${this.translate.instant('myBooking')} ${this.books}`
              : response.isBooked && this.role === 'DOCTOR' && this.editUser
              ? `${this.translate.instant('isBooked')}`
              : `${this.translate.instant('doctorBooking')} ${
                  this.BookQuantity
                } ${this.translate.instant('space')}`;
        });

        if (this.role === 'USER' && this.editUser) {
          this.events = response.$values.filter(
            (response: any) =>
              response.isBooked && response.userId.includes(this.doctorId)
          );
        } else if (this.role === 'DOCTOR' && this.editUser) {
          this.events = response.$values.filter(
            (response: any) =>
              response.isBooked && response.doctorId === this.doctorId
          );
        } else {
          this.events = response.$values.filter(
            (response: any) => response.doctorId === this.doctorId
          );
        }


        //sumofbooks
        const filteredArray = this.events.map(
          (event: any) => event.Events.$values
        );
        const nested = filteredArray.flat();
        this.DoctorBooks = nested.filter((event: Calendar) => event.isBooked);
        this.UserBooks = nested.filter(
          (event: Calendar) =>
            event.userId === this.doctorId || event.userId === this.id
        );
        nested.some(
          (event: Calendar) => (this.isUserEntered=event.userId === this.id)
        );        
        this.events.forEach(
          (event: any) => (this.isDoctorEntered = event.doctorId === this.id)
        );

        this.SumDoctorBooks = this.DoctorBooks.length;

        this.SumUserBooks = this.UserBooks.length;
        this.dataService.updateBook(
          this.role === 'USER' ? this.SumUserBooks : this.SumDoctorBooks
        );
      },

      error: (error) => {},
    });
    if (this.isAdmin) {
      this.dataService.getByRoles('USER').subscribe({
        next: (response) => {
          this.userType = response.some(
            (item: any) => item.id === this.doctorId
          );
        },
        error: (error) => {},
      });
    }

    this.dataService.getAllUsers().subscribe({
      next: (response:any) => {
        this.DoctorBooks.forEach((book: any) => {
          response.forEach((user: any) => {
            if (user.id === book.userId) {
              book.name = user.name;
              book.lastName = user.lastName;
            }
          });
        });
        this.FilteredUsers = response.filter((user: any) => {
          const matchedEvents = this.events.filter(
            (event: any) => event.doctorId === user.id
          );
          matchedEvents.forEach(
            (event: any) => (event.image = user.profileImage)
          );
          return matchedEvents.length > 0;
        });

       
        this.events.forEach((event:any) => {
          if (Array.isArray(event.userId) && event.userId.length > 0) {
              event.userId.some((userId:string )=> {
                  if (!response.some((response:User) => response.id === userId)) {
                    const events=event.Events.$values.filter((event:ChildEvent)=>(event.userId===userId))
                    for (let i = 0; i < events.length; i++) {
                      this.deleteEvent(events[i]);                                            
                  }
                  }
              });
          }
      });
      },
      error: (error) => {},
    });
    
  }

  openWindow(): void {
    this.OpenDateInput = true;
  }

  addChildEvent(): void {
    const startDate = new Date(this.dateStart);
    const adjustedStartDate = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    );
    const endDate = new Date(adjustedStartDate.getTime() + 15 * 60 * 1000);
    this.dateStart = adjustedStartDate.toISOString();
    this.dateEnd = endDate.toISOString();
    this.inputValue.start = this.dateStart;
    this.inputValue.endDate = this.dateEnd;
    this.inputValue.isBooked = false;
    this.ChildEvents.push({ ...this.inputValue });
  }

  CalendarModelId!: number;
  Id!: number;
  handleDateClick(CalendarModelId: number, Id: number): void {
    this.CalendarModelId = CalendarModelId;
    this.Id = Id;
  }
  addEvent(): void {
    const Title = 'დაჯავშნა';
    this.inputValue.start = this.ChildEvents[0].start;
    this.inputValue.endDate = this.ChildEvents[0].endDate;
    this.inputValue.title = Title;
    this.inputValue.isBooked = false;
    this.inputValue.doctorId = this.doctorId;
    this.inputValue.events = this.ChildEvents;

    this.dataService.addEvent(this.inputValue).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {},
    });
  }

  event!: any;
  filteredEvents: ChildEvent[] = [];
  user!: string;
  name!: string;
  lastName!: string;
  bookDate: Calendar[] = [];
  handleEvent(event: any): void {
    const id = localStorage.getItem('id');
    if (id) {
      this.userEntered = false;
      this.isOpen = false;
    } else {
      this.userEntered = true;
    }
    this.Editable = false;
    this.PlaceEvents = event.Events.$values;
    if (!this.editUser && id) {
      this.isOpen = true;
    } else if (this.editUser && this.role === 'DOCTOR') {
      this.filteredEvents = this.DoctorBooks.filter(
        (events: ChildEvent) => events.calendarModelId === event.id
      );
    } else if (this.editUser && this.role === 'USER') {
      this.bookDate = this.PlaceEvents.filter(
        (event) => event.userId === this.doctorId
      );
    }

    this.event = event;
  }

  eventStart!: any;
  eventEnd!: string;
  editEvent(): void {
    const UserId = localStorage.getItem('id') || null;
    if (this.event.userId) {
      this.event.userId.push(UserId);
    } else {
      this.event.userId = [UserId];
    }
    this.event.isBooked = true;
    this.event.title = 'დაჯავშნილია';
    const dateInUTC = new Date(
      this.event.start.getTime() - this.event.start.getTimezoneOffset() * 60000
    );
    this.event.start = dateInUTC.toISOString();
    const dataEvent = {
      title: this.event.title,
      isBooked: this.event.isBooked,
      userId: this.event.userId,
      start: this.event.start,
      endDate: this.event.endDate,
      id: this.event.id,
      doctorId: this.event.doctorId,
      color: '',
    };

    this.dataService.editEvent(dataEvent).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {},
    });

    const event = this.PlaceEvents.filter(
      (event: Calendar) => event.id === this.Id
    );
    event.forEach((event: Calendar) => {
      this.eventStart = event.start;
      this.eventEnd = event.endDate;
    });

    const data = {
      userId: UserId,
      isBooked: true,
      description: this.inputValue.description,
      calendarModelId: this.CalendarModelId,
      id: this.Id,
      start: this.eventStart,
      endDate: this.eventEnd,
    };
    this.dataService
      .editEventForEvent(data, this.CalendarModelId, this.Id)
      .subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {},
      });
  }
  removeForm(): void {
    this.OpenDateInput = false;
    this.Editable = false;
    this.isOpen = false;
    this.SelectEvent = '';
    this.filteredEvents = [];
    this.ShowBookDescription = false;
    this.Deletable = false;
    this.bookDate = [];
    this.userEntered = false;
    this.isHoliday = false;
  }
  SelectEvent = '';
  UserBooks: ChildEvent[] = [];
  Deletable: boolean = false;
  ShowBookDescription = false;
  editEnabled(): void {
    const id = localStorage.getItem('id');
    if (id) {
      this.Editable = true;
    } else {
      this.userEntered = true;
    }
  }
  selectBook(book: ChildEvent): void {
    this.ShowBookDescription = true;
    this.Editable = false;
    this.CalendarModelId = book.calendarModelId;
    this.Id = book.id;
    this.editdescription = book.description;
    this.event = book;
  }

  deleteEnabled(): void {
    const id = localStorage.getItem('id');
    if (id) {
      this.Deletable = true;
    } else {
      this.userEntered = true;
    }
  }

  // change description
  editDescription(): void {
    this.event.description = this.inputValue.description;
    this.dataService
      .editEventForEvent(this.event, this.CalendarModelId, this.Id)
      .subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {},
      });
  }
  inputValue: any = {};
  handleChange(event: any): void {
    const inputElement = event.target;
    const name = inputElement.name;
    const value = inputElement.value;
    this.inputValue = { ...this.inputValue, [name]: value };
  }

  dataEvent!: EditCalendarEvent;
  data!: EditEvent;
  anotherBook: boolean = false;
  filteredId!: string;
  filteredArray: ChildEvent[] = [];

  removeEvent(book:ChildEvent):void{
    this.deleteEvent(book);
    window.location.reload()
  }
  deleteEvent(book: ChildEvent) {
    this.data = {
      userId: null,
      isBooked: false,
      description: '',
      calendarModelId:book?.calendarModelId&& book.calendarModelId,
      id:book?.id&& book.id,
      start:book?.start&& book.start,
      endDate:book?.endDate&& book.endDate,
    };
    const filtered = this.events.filter(
      (event: CalendarEvent) =>book?.calendarModelId&& event.id === book?.calendarModelId
    );

    filtered.forEach(
      (event: any) => (
        (this.filteredId = event.userId.filter(
          (userId: string) => userId !== this.doctorId
        )),
        (this.dataEvent = {
          endDate: event.endDate,
          id: event.id,
          doctorId: event.doctorId,
          color: '',
          title: (event.title = 'დაჯავშნა'),
          isBooked: (event.isBooked = false),
          start: (event.start = new Date(
            event.start.getTime() - event.start.getTimezoneOffset() * 60000
          ).toISOString()),
          userId: this.filteredId,
        })
      )
    );

    this.dataService
      .editEventForEvent(this.data, this.data.calendarModelId, this.data.id)
      .subscribe({
        next: (response) => {
            // window.location.reload();
          filtered.forEach((event: any) => {
            this.filteredArray = event.Events.$values.filter(
              (childEvent: ChildEvent) =>
                childEvent.id !== response.id && childEvent.isBooked
            );
          });

          if (this.filteredArray.length === 0) {
            this.dataService.editEvent(this.dataEvent).subscribe({
              next: (response) => {
                  // window.location.reload();
                },
              error: (error) => {},
            });
          } else {
            return;
          }
        },
        error: (error) => {},
      });
  }
}
