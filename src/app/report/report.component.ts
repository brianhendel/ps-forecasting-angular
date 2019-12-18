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
import { UserService } from '../services/user.service'

import { Event, EventHolder, ReportRow, Category } from '../event';

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
    private userService: UserService
  ) {
    this.reportDataSource = new MatTableDataSource()
  }

  displayedColumns: string[] = ['category', 'month0', 'month1', 'month2', 'quarter0', 'quarter1'];
  approvedCats: string[] = ['Confirmed Utilization', 'Tentative Utilization', 'Holiday', 'PTO', 'Admin', 'Professional Development', 'Group Training', 'Sales Support'];
  foundCats: Category[] = []
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
    this.graphService.getReport(this.userService.activeEmail, this.eventHolder)
      .then((result) => {
        this.eventHolder = result;
        console.log(result);
        this.getCategories(this.eventHolder);
        this.calcDuration();
        this.calcResults();
        this.reportDataSource.data = this.reportArray;
        this.progressBarService.hideBar();
      })
  }

  getCategories(groups: EventHolder[]) {
    let foundCats: Category[] = [];
    let foundIds: number[] = []
    groups.forEach(group => {
      group.eventArray.forEach(event => {
        event.categories.forEach(c => {
          if (c.startsWith('[')) {
            let newCat: Category = { id: 0, name: 'temp' }
            newCat.id = Number(c.charAt(1))
            newCat.name = c
            if (foundIds.includes(newCat.id)) {
            } else {
              foundCats.push(newCat)
              foundIds.push(newCat.id)
            }
          }
        });
      })
    })
    this.foundCats = foundCats.sort((a, b) => a.id - b.id)
  }

  calcResults() {
    let temp: ReportRow[] = [];
    this.foundCats.forEach(cat => {
      temp.push({ category: cat.name, result: this.calcData(cat.name) }
      )
    })
    this.reportArray = temp;
  }

  calcData(catName: string) {
    let rowData: number[] = [];
    this.eventHolder.forEach(group => {
      rowData.push(group.eventArray
        .filter(group => group.categories.includes(catName))
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
