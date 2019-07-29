import { Injectable } from '@angular/core';

import * as moment from 'moment-timezone';
import { faMonument } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { 
    
  }

  getDates() {    
    return 'test'
  }

  getTest(){
    return 'testing string'
  }
}