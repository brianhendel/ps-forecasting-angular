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

import { Event, EventHolder, ReportRow } from '../event';

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
    this.reportDataSource = new MatTableDataSource()
  }

  displayedColumns: string[] = ['category', 'month0', 'month1', 'month2', 'quarter0', 'quarter1'];
  approvedCats: string[] = ['Confirmed Utilization', 'Tentative Utilization', 'Holiday', 'PTO', 'Admin', 'Professional Development', 'Group Training', 'Sales Support'];
  private reportDataSource: MatTableDataSource<ReportRow>;
  private reportArray: ReportRow[] = [];
  private eventHolder: EventHolder[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  ngOnInit() {
    this.reportDataSource.paginator = this.paginator;
    this.reportDataSource.sort = this.sort;
    this.buildEventHolder()
    this.runReport()
  }

  buildEventHolder() {
    this.eventHolder = [
      { name: 'month0', displayName: moment().startOf('month').format('MMMM YYYY'), start: moment().startOf('month').format(), end: moment().endOf('month').format(), eventArray: [] },
      { name: 'month1', displayName: moment().add(1, 'month').startOf('month').format('MMMM YYYY'), start: moment().add(1, 'month').startOf('month').format(), end: moment().add(1, 'month').endOf('month').format(), eventArray: [] },
      { name: 'month2', displayName: moment().add(2, 'month').startOf('month').format('MMMM YYYY'), start: moment().add(2, 'month').startOf('month').format(), end: moment().add(2, 'month').endOf('month').format(), eventArray: [] },
      { name: 'quarter0', displayName: 'Q' + moment().quarter(), start: moment().startOf('quarter').format(), end: moment().endOf('quarter').format(), eventArray: [] },
      { name: 'quarter1', displayName: 'Q' + moment().add(1, 'quarter').quarter(), start: moment().add(1, 'quarter').startOf('quarter').format(), end: moment().add(1, 'quarter').endOf('quarter').format(), eventArray: [] },
    ]
  }

  runReport() {
    this.progressBarService.showBar();
    //temporarily 'me'
    this.graphService.getReport('me', this.eventHolder)
      .then((result) => {
        this.eventHolder = result;
        console.log(result);
        this.calcDuration()
        this.calcResults()
        this.reportDataSource.data = this.reportArray;
        this.progressBarService.hideBar();
      })
  }

  calcResults() {
    let temp: ReportRow[] = [];
    this.approvedCats.forEach(cat => {
      temp.push({ category: cat, result: this.calcData(cat) }
      )
    })
    this.reportArray = temp;
  }

  calcData(cat: string) {
    let rowData: number[] = [];
    this.eventHolder.forEach(group => {
      rowData.push(group.eventArray
        .filter(group => group.categories.includes(cat))
        .reduce((acc, group) => acc + group.duration, 0)
      )
    })
    return rowData

  }

  calcDuration() {
    this.eventHolder.forEach(view => {
      view.eventArray.forEach(e => {
        e.duration = this.dateService.dateDiff(e.start.dateTime, e.end.dateTime)
      })
    })
  }
}
