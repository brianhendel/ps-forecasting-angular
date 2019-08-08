import { Injectable } from '@angular/core';
import {FormControl, Validators} from '@angular/forms'

import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public endType: string;
  public sDT: string;
  public eDT: string;
  public diff: number;

  viewControl = new FormControl('',[Validators.required])
  selectFormControl = new FormControl('', Validators.required)
  public views: View[] = [
    {value: 'week', viewValue: 'Week'},
    {value: 'month', viewValue: 'Month'},
    {value: 'quarter', viewValue: 'Quarter'}
  ]

  constructor() {
    this.setEndType('week');
  }

  setEndType(endType: string) {
    this.endType = endType;
    this.sDT = moment().startOf('week').add(1, 'week').format();
    this.eDT = moment().add(1, 'week').endOf(endType).format();
    this.dateDiff(this.sDT, this.eDT)
  }

  dateDiff(start: string, end: string) {
    this.diff = moment(end).diff(moment(start), 'hours', true);

  }

}
export interface View {
  value: string;
  viewValue: string;
}