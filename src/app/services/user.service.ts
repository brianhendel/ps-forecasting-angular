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
  public activeEmail: string;

  setLoggedInUser(user: User) {
    this.loggedInUser = user
    this.activeEmail = user.mail
  }
  
  setAlt(nameInput: string) {
    let conv = nameInput.toLowerCase().replace(" ",".") + '@' + this.loggedInUser.mail.split("@")[1];
    this.activeEmail = conv;
    
    return conv
  }

}
