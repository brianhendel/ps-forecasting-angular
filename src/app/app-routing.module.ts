import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportComponent } from './report/report.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'report', component: ReportComponent},
  { path: 'admin', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
