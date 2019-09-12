import { Injectable } from '@angular/core';
import { Client, GraphRequest, ResponseType } from '@microsoft/microsoft-graph-client';

import { AuthService } from './auth.service';
import { Event, EventHolder } from '../event';
//import { Calendar } from '../calendar';

import { AlertsService } from './alerts.service';
import { DateService } from './date.service';

import { Observable, of } from 'rxjs';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  public eventsGraph: Event[];
  private graphClient: Client;
  private defaults = {
    basePath: 'https://graph.microsoft.com/v1.0/',
    calendarPath: '/calendar/calendarView',
    batchPath: 'https://graph.microsoft.com/v1.0/$batch',
    select: 'subject,organizer,start,end,categories',
    orderBy: 'start/dateTime ASC',
    top: '1000'
  }

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private dateService: DateService) {

    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service
        let token = await this.authService.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });

        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  }

  async getEvents(): Promise<Event[]> {
    try {
      let result = await this.graphClient
        .api('/me/calendar/calendarView' + '?startdatetime=' + this.dateService.sDT + '&enddatetime=' + this.dateService.eDT)
        .select('subject,organizer,start,end,categories')
        .orderby('start/dateTime ASC')
        .top(1000)
        .get();

      this.eventsGraph = result.value;
      return result.value;
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

  getReport(calendar: string, eventHolder: EventHolder[]): EventHolder[] {
    let result: EventHolder[] = [];
    let urls: string[] = [];
    eventHolder.forEach(view => {
      urls.push(this.buildUrl(calendar, view))
    })
    console.log(urls)
    this.batch(urls)

    return result
  }

  buildUrl(calendar: string, view: EventHolder) {
    let url: string;
    url = '/' + calendar + this.defaults.calendarPath + '?startdatetime=' + view.start + '&enddatetime=' + view.end + '&$select=' + this.defaults.select + '&$orderby=' + this.defaults.orderBy + '&$top=' + this.defaults.top;
    return url;
  }

  batch(urls: string[]) {
    let batch = { requests: [] };
    let i = 1;
    urls.forEach(u => {
      batch.requests.push({ id: i, method: 'GET', url: u })
      i++
    })
    console.log(batch)
    this.getBatch(batch)
  }

  async getBatch(batch: { requests: any[]; }) {
    try {
      let result = await this.graphClient
      .api('/$batch')
      .post(JSON.stringify(batch));
      console.log(result)
      return result
    } catch (error) {
      this.alertsService.add('Batch API error', JSON.stringify(error, null, 2));
    }
  }

}

  // async getCalendars(): Promise<Calendar[]> {
  //   try {
  //     let result = await this.graphClient
  //       .api('/me/calendars')
  //       .select('name,owner,canEdit,canViewPrivateItems')
  //       .top(100)
  //       .get();
  // 
  //     this.calendarsGraph = result.value
  //     return result.value;
  //   } catch (error) {
  //     this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
  //   }
  // }