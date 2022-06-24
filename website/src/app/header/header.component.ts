import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, shareReplay } from 'rxjs';
import {booleanReturn} from "../interfaces/boolean.interface";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  isAuth$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isAuth$ = this.auth.isAuth$.pipe(
      shareReplay(1)
    );
    this.isAdmin$ = this.auth.isAdmin$;
  }

  onLogout() {
    this.auth.logout();
  }

}

