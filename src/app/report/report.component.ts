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

import { Event, EventHolder, ReportRow, ReportArray } from '../event';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private dateService: DateService,
    private alertsService: AlertsService,
    private progressBarService: ProgressBarService,
  ) {
    this.dataSource = new MatTableDataSource()
  }

  displayedColumns: string[] = ['category', 'week-duration', 'month-duration', 'quarter-duration'];
  private dateArray: string[] = ['week', 'month', 'quarter'];
  private dataSource: MatTableDataSource<Event[]>;
  private eventHolder: EventHolder[];
  private reportArray: ReportArray;
  private catArray: string[] = ['test']

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  ngOnInit() {
    this.getData()
    //this.findCat();
    //this.calcResults();
  }
  
  getData() {
    this.progressBarService.showBar();
    this.clearArray();
    this.dateArray.forEach(element => {
      this.dateService.setEndType(element.valueOf())
      this.graphService.getEvents()
      .then((events) => {
        this.eventHolder.push({ name: element, eventArray: events })
      });
    })
    console.log(this.eventHolder)
    this.progressBarService.hideBar();
  }

  findCat() {
    this.eventHolder.forEach(e1 => {
      e1.eventArray.forEach(e2 => {
        e2.categories.forEach(e3 => {
          this.catArray.push(e3.toString())
        });
      });
    });
    console.log(this.catArray)
    this.catArray = Array.from(new Set(this.catArray))
    console.log(this.catArray)
  }

  calcResults() {

  }

  clearArray() {
    this.eventHolder = [];
    this.reportArray = { reportData: [] };
    this.catArray = [];
  }
}
