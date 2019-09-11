import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'

import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public endType: string;
  public activeView: string;
  public sDT: string;
  public eDT: string;
  public diff: number;

  viewControl = new FormControl('', [Validators.required])
  selectFormControl = new FormControl('', Validators.required)
  public views: View[] = [
    { value: 'thisWeek', viewValue: 'This Week' },
    { value: 'nextWeek', viewValue: 'Next Week' },
    { value: 'thisMonth', viewValue: 'This Month' },
    { value: 'nextMonth', viewValue: 'Next Month' },
    { value: 'nextMonth2', viewValue: 'Month After Next' },        
    { value: 'thisQuarter', viewValue: 'This Quarter' }
  ]

  constructor() {
    this.setEndType('thisWeek');
  }

  setEndType(endType: string) {
    switch (endType) {
      case 'thisWeek': {
        this.sDT = moment().startOf('week').format();
        this.eDT = moment().endOf('week').format();
        this.activeView = "This Week"
        break
      }

      case 'nextWeek': {
        this.sDT = moment().startOf('week').add(1, 'week').format();
        this.eDT = moment().add(1, 'week').endOf('week').format();
        this.activeView = "Next Week"
        break
      }

      case 'thisMonth': {
        this.sDT = moment().startOf('month').format();
        this.eDT = moment().endOf('month').format();
        this.activeView = "This Month"
        break
      }

      case 'nextMonth': {
        this.sDT = moment().add(1, 'month').startOf('month').format();
        this.eDT = moment().add(1, 'month').endOf('month').format();
        this.activeView = "Next Month"
        break
      }

      case 'nextMonth2': {
        this.sDT = moment().add(2, 'month').startOf('month').format();
        this.eDT = moment().add(2, 'month').endOf('month').format();
        this.activeView = "Month After Next"
        break
      }

      case 'thisQuarter': {
        this.sDT = moment().startOf('week').add(1, 'week').format();
        this.eDT = moment().add(1, 'week').endOf('quarter').format();
        this.activeView = "This Quarter"
        break
      }
    }
  }

  reportDates() {

  }

  dateDiff(start: string, end: string) {
    this.diff = moment(end).diff(moment(start), 'hours', true);
    return moment(end).diff(moment(start), 'hours', true);
  }
}

export interface View {
  value: string;
  viewValue: string;
}