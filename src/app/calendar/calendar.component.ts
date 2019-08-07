import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import { DataSource } from '@angular/cdk/collections'

import { GraphService } from '../services/graph.service';
import { Event, DateTimeTimeZone } from '../event';
import { AlertsService } from '../services/alerts.service';
import { DateService } from '../services/date.service';
import { Observable, of } from 'rxjs';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  
  constructor(
    private graphService: GraphService,
    private dateService: DateService,
    private alertsService: AlertsService
    ) { 
    }
    
    dataSource: EventDataSource
    @ViewChild('table',{static:true}) table: MatTable<Event[]>;
    displayedColumns = ['organizer', 'subject', 'start', 'end', 'categories', 'duration'];

  ngOnInit() {
    this.graphService.getEvents()
    .then((events) => {
      this.dataSource = new EventDataSource(this.graphService);
    });
  }

  refreshTable(endType: string) {
    this.dateService.setEndType(endType);
    this.graphService.getEvents()
    .then((events) => {
      this.graphService.eventsGraph;
      console.log("Updated eventsGraph with " + this.graphService.eventsGraph.length + " events")
      this.dataSource = new EventDataSource(this.graphService)
    })
    
  }
}

export class EventDataSource extends DataSource<any> {
  constructor(private graphService: GraphService) {
    super();
  }
  connect(): Observable<Event[]> {
    return this.graphService.getData();
  }
  disconnect() {
  }
}