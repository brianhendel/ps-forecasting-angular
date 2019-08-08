import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  showProgBar: boolean;

  constructor() {
    this.showProgBar = false;
   }

  showBar() {
    this.showProgBar = true;
  }

  hideBar() {
    this.showProgBar = false;
  }

}
