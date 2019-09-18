import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { GraphService } from '../services/graph.service';
import { AlertsService } from '../services/alerts.service';
import { DateService } from '../services/date.service';
import { ProgressBarService } from '../services/progress-bar.service';

import { Event, DateTimeTimeZone } from '../event';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private dateService: DateService,
    private alertsService: AlertsService,
    private progressBarService: ProgressBarService
  ) {
    this.dataSource = new MatTableDataSource()
  }

  displayedColumns: string[] = ['organizer', 'subject', 'start', 'end', 'categories', 'duration'];
  private allEvents = [];
  private showConfirmed: boolean = false;
  private dataSource: MatTableDataSource<Event>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.refreshTable('thisWeek')
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filterSetup();
  }

  refreshTable(endType: string) {
    this.progressBarService.showBar();
    this.dateService.setEndType(endType);
    this.graphService.getEvents()
      .then((events) => {
        this.dataSource.data = events;
        this.allEvents = events;
        this.calcDuration();
        console.log("Updated eventsGraph with " + this.graphService.eventsGraph.length + " events")
        this.dataSource.paginator.firstPage();
        this.showConfirmed = false;
        this.progressBarService.hideBar();
      })
  }

  setUtil() {
    if (this.showConfirmed == false) {
      this.dataSource.data = this.allEvents.filter(e => e.categories.includes("Confirmed Utilization"))
      this.showConfirmed = true;
    } else {
      this.dataSource.data = this.allEvents;
      this.showConfirmed = false;
    }
  }

  calcDuration() {
    this.dataSource.data.forEach(element => {
      element.duration = moment(element.end.dateTime).diff(moment(element.start.dateTime), 'hours', true)
    });
  }

  getTotalDuration() {
    return this.dataSource.filteredData.map(d => d.duration).reduce((acc, value) => acc + value, 0)
  }

  formatDateTimeTimeZone(dateTime: DateTimeTimeZone): string {
    try {
      return moment.tz(dateTime.dateTime, dateTime.timeZone).format();
    }
    catch (error) {
      this.alertsService.add('DateTimeTimeZone conversion error', JSON.stringify(error));
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotalDuration();
  }

  filterSetup() {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    } return search;
  }
}