export interface User{
    name:string,
    lastName:string,
    privateNumber:number,
    email:string,
    id:string,
    category:string,
    description:String,
    role:string,
    profileImage:string,
    cv:string
  }

  export interface Calendar{
    $id:string,
    Events:Event,
    color:Color|'',
    doctorId:string,
    userId:string[]|string,
    id:number,
    isBooked:boolean,
    start:string,
    endDate:string,
    end:Date,
    title:string
  }
  export interface EditCalendarEvent{
    color:Color|'',
    doctorId:string,
    userId:string[]|string,
    id:number,
    isBooked:boolean,
    start:Date|string,
    endDate:string,
    title:string
  }
  export interface Event {
    $id: string;
    $values:ChildEvent[]; 
  }
  export interface Color {
    primary: string;
    secondary: string;
  }
  
  export interface ChildEvent{
    $id:string,
    calendarModelId:number,
    description:string,
    endDate:string,
    id:number,
    isBooked:boolean,
    lastName:string,
    name:string,
    start:string,
    userId:string|null
  }
  export interface EditEvent{
    calendarModelId:number,
    description:string,
    endDate:string,
    id:number,
    isBooked:boolean,
    start:string,
    userId:string|null
  }