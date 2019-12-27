import { Injectable } from '@angular/core';
import { User } from '../user'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( ) { 
  }

  ngOnInit() {
  }

  public loggedInUser: User;
  public activeUser: string;
  public activeEmail: string;
  public userReady: boolean = false;

  setLoggedInUser(user: User) {
    this.loggedInUser = user;
    this.activeUser = user.displayName;
    this.activeEmail = user.mail;
    this.userReady = true;

  }
  
  setAlt(nameInput: string) {
    this.activeUser = nameInput;
    let conv = nameInput.toLowerCase().replace(" ",".") + '@' + this.loggedInUser.mail.split("@")[1];
    this.activeEmail = conv;
    
    return conv
  }

}
