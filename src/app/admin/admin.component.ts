import { Component, OnInit } from '@angular/core';
import { GraphService, CalendarGroup, Calendar } from '../services/graph.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  private calendarGroups: CalendarGroup[];
  private calendarsInGroup: Calendar[];
  private eventsInCalendar: Event[];

  private groupId: string;
  private calendarId: string;


  constructor(
    private graphService: GraphService,
  ) { }

  ngOnInit() {
    this.pullCalendarGroups();
  }

  pullCalendarGroups() {
    this.graphService.getCalendarGroups()
      .then ((result) => {
        this.calendarGroups = result.value;
        console.log(this.calendarGroups)
      })
  }

  pullCalendars(groupId: string) {
    this.groupId = groupId;
    this.graphService.getCalendars(groupId)
      .then ((result) => {
        this.calendarsInGroup = result.value;
        console.log(this.calendarsInGroup)
      })
  }
  
  pullCalendarEvents(groupId: string, calendarId: string) {
    this.calendarId = calendarId;
    this.graphService.getCalendarEvents(groupId, calendarId)
      .then ((result) => {
        //this.eventsInCalendar = result.values;
        console.log(result)
      })
  }
}
