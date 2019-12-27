import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  

  constructor(
    private authService: AuthService,
    public userService: UserService
    ) {    }

  ngOnInit() {
  }

  async signIn(): Promise<void> {
    await this.authService.signIn();
    }

}

