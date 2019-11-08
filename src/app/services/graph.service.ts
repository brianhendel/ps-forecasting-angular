import { Injectable } from '@angular/core';
import { Client, GraphRequest, ResponseType, BatchResponseContent } from '@microsoft/microsoft-graph-client';

import { AuthService } from './auth.service';
import { Event, EventHolder } from '../event';
//import { Calendar } from '../calendar';

import { AlertsService } from './alerts.service';
import { DateService } from './date.service';

import { Observable, of } from 'rxjs';
import { async } from '@angular/core/testing';
import { Response } from 'selenium-webdriver/http';

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
      console.log(result)
      this.eventsGraph = result.value;
      return result.value;
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

  async getReport(calendar: string, eventHolder: EventHolder[]): Promise<EventHolder[]> {
    let result: EventHolder[] = eventHolder;
    let batchResponse: GraphResponse;
    let urls: string[] = this.buildUrls(calendar, eventHolder);

    try {
      batchResponse = await this.getBatch(this.batchGen(urls))

    } catch (error) {
      this.alertsService.add('getReport error', JSON.stringify(error, null, 2));
    }

    batchResponse.responses.forEach((resp, i) => {
      result[resp.id].eventArray = resp.body.value
    })

    return result
  }

  buildUrls(calendar: string, eventHolder: EventHolder[]) {
    let urls: string[] = [];
    eventHolder.forEach(view => {
      urls.push('/' + calendar + this.defaults.calendarPath + '?startdatetime=' + view.start + '&enddatetime=' + view.end + '&$select=' + this.defaults.select + '&$orderby=' + this.defaults.orderBy + '&$top=' + this.defaults.top)
    })
    return urls;
  }

  batchGen(urls: string[]) {
    let batch = { requests: [] };
    let i = 0;
    urls.forEach(u => {
      batch.requests.push({ id: i, method: 'GET', url: u })
      i++
    })
    console.log(batch)
    return batch
  }

  async getBatch(batch: { requests: any[]; }) {
    try {
      let result = await this.graphClient
        .api('/$batch')
        //.responseType(ResponseType.TEXT)
        .post(JSON.stringify(batch));
      return result
    } catch (error) {
      this.alertsService.add('Batch API error', JSON.stringify(error, null, 2));
    }
  }

  async getCalendarGroups(): Promise<CalendarGroupResponse> {
    try {
      let result = await this.graphClient
        .api('/me/calendarGroups/')
        .top(100)
        .get();
      return result;
    } catch (error) {
      this.alertsService.add('Could not get calendarGroup', JSON.stringify(error, null, 2));
    }
  }

  async getCalendars(groupId: string): Promise<CalendarResponse> {
    try {
      let result = await this.graphClient
        .api('/me/calendargroups/' + groupId + '/calendars')
        .top(100)
        .get();
      return result;
    } catch (error) {
      this.alertsService.add('Could not get calendarGroup', JSON.stringify(error, null, 2));
    }
  }

  async getCalendarEvents(groupId: string, calendarId: string): Promise<Event[]> {
    try {
      let result = await this.graphClient
        .api('/me/calendarGroups/' + groupId + '/calendars/' + calendarId + '/calendarView' + '?startdatetime=' + this.dateService.sDT + '&enddatetime=' + this.dateService.eDT)
        .select('subject,organizer,start,end,categories')
        .orderby('start/dateTime ASC')
        .top(1000)
        .get();
      return result;
    } catch (error) {
      this.alertsService.add('Could not get calendarGroup', JSON.stringify(error, null, 2));
    }
  }
}


export interface GraphResponse {
  "responses": GraphResponseView[];
}

export interface GraphResponseView {
  id: string;
  status: number;
  headers: {
    "Cache-Control": string;
    "Content-Type": string;
    "OData-Version": string;
  };
  body: {
    "@odata.context": string;
    value: Event[]
  };
}

export interface CalendarGroupResponse {
  "@odata.context": string;
  value: CalendarGroup[]
}

export interface CalendarGroup {
  id: string;
  name: string;
}

export interface CalendarResponse {
  "@odata.context": string;
  value: Calendar[]
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  changeKey: string;
  canShare: string;
  canViewPrivateItems: boolean;
  canEdit: boolean;
  owner: {
    name: string;
    address: string;
  }
}


