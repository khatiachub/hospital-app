import { CalendarDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {

  override dateAdapter: DateAdapter; 

  constructor(dateAdapter: DateAdapter, private translate: TranslateService) {
    super(dateAdapter);
    this.dateAdapter = dateAdapter;
  } 
  override weekViewHour({ date, locale }: DateFormatterParams): string {
    const resolvedLocale = locale || 'en'; 
    const startTime = formatDate(date, 'HH:mm', resolvedLocale);
    const endDate = new Date(date.getTime() + (60 * 60 * 1000));
    const endTime = formatDate(endDate, 'HH:mm', resolvedLocale);
    return `${startTime} - ${endTime}`;
  }
  
  override weekViewColumnHeader({ date,locale}: DateFormatterParams): string {
    const translatedDaysOfWeek = [
      this.translate.instant('sun'),
      this.translate.instant('mon'),
      this.translate.instant('tue'),
      this.translate.instant('wed'),
      this.translate.instant('thu'),
      this.translate.instant('fri'),
      this.translate.instant('sat')
    ];
    const resolvedLocale = locale || 'en'; 
    const dayOfMonth = formatDate(date, 'd', resolvedLocale); 
    const dayOfWeekIndex = date.getDay();
    return `${dayOfMonth} ${translatedDaysOfWeek[dayOfWeekIndex]}`
    
  }
  override weekViewTitle({ date, locale }: DateFormatterParams): string {
    const resolvedLocale = locale || 'en'
    return formatDate(date, 'MMM y', resolvedLocale);
  }
}
