import { Injectable } from '@angular/core';
import { DateArray } from './datearray';

import * as moment from 'moment-timezone';
import { faMonument } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  public dateArray: DateArray;

  constructor() { 
    this.dateArray.today = 'test date'
  }

  getDates() {    
    return this.dateArray.today
  }

  getTest(){
    return 'testing string'
  }
}
