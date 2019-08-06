import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';

import { AuthService } from './auth.service';
import { Event } from '../event';
import { AlertsService } from './alerts.service';

import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private eventsGraph: Event[];
  private graphClient: Client;

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService) {

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

  async getEvents(sDT: string, eDT: string): Promise<Event[]> {
    try {

      let result = await this.graphClient
        .api('/me/calendar/calendarView' + '?startdatetime=' + sDT + '&enddatetime=' + eDT)
        .select('subject,organizer,start,end,categories')
        .orderby('start/dateTime DESC')
        .top(1000)
        .get();

      this.eventsGraph = result.value;
      return result.value;
    } catch (error) {
      this.alertsService.add('Could not get events', JSON.stringify(error, null, 2));
    }
  }

  serveData(): Observable<Event[]> {
    return of<Event[]>(this.eventsGraph)
  }
}