import { Component, OnInit } from '@angular/core';

import { DateService } from '../services/date.service'
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private dates: string[];
  public endType: string;
  public sDT: string;
  public eDT: string;

  constructor() { 
    this.dates = [
      moment().year(), 
      moment().month(),
      moment().startOf('week').format(),
      moment().endOf('week').format()

    ]
  }

  ngOnInit() {

  }

  setEDT(endType) {
    this.endType = endType;
    this.sDT = moment().startOf('week').add(1,'week').format();
    this.eDT = moment().endOf(endType).add(1,'week').endOf(endType).format();
  }

}
