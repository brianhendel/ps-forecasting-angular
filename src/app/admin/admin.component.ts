import { Component, OnInit } from '@angular/core';

import { DateService } from '../services/date.service'


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private dateService: DateService) { }

  ngOnInit() {

  }
}
