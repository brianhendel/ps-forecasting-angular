import { Injectable } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( 
    private authService: AuthService,
  ) { 
    this.activeEmail = this.authService.user.email;
  }

  ngOnInit() {
    console.log(this.activeEmail)
  }

  public activeEmail: string;

  setAlt(nameInput: string) {
    let conv = nameInput.toLowerCase().replace(" ",".") + '@' + this.authService.user.email.split("@")[1];
    this.activeEmail = conv;
    return conv
  }


}
