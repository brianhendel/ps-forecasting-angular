import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { DataSource } from '@angular/cdk/table'

import { GraphService } from '../services/graph.service';
import { Event, DateTimeTimeZone } from '../event';
import { AlertsService } from '../services/alerts.service';
import { DateService } from '../services/date.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  private events: Event[];
  private dataSource = new EventDataSource(this.graphService)

  constructor(
    private dateService: DateService,
    private graphService: GraphService,
    private alertsService: AlertsService
  ) { }

  ngOnInit() {
    this.graphService.getEvents(this.dateService.sDT, this.dateService.eDT)
      .then((events) => {
        this.events = events;
      });
  }

  formatDateTimeTimeZone(dateTime: DateTimeTimeZone): string {
    try {
      return moment.tz(dateTime.dateTime, dateTime.timeZone).format();
    }
    catch (error) {
      this.alertsService.add('DateTimeTimeZone conversion error', JSON.stringify(error));
    }
  }

  refreshTable(endType: string) {
    this.dateService.setEDT(endType);
    this.graphService.getEvents(this.dateService.sDT, this.dateService.eDT)
      .then((events) => {
        this.events = events;
      });
  }
}

export class EventDataSource extends DataSource<any> {
  constructor(private graphService: GraphService) {
    super();
  }
  connect(): Observable<Event[]> {
    return this.graphService.serveData();
  }
  disconnect() {
  }
}