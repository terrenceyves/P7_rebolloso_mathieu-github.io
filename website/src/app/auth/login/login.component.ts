import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;
//injection des services
  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }
//event binding
  onLogin() {
    this.loading = true;
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
    this.auth.loginUser(email, password).pipe(
      tap(() => {
        this.loading = false;
        this.router.navigate(['/']);
      }),
      catchError(err => {
        this.loading = false;
        this.errorMsg = err.error.message;
        return EMPTY;
      })
    ).subscribe();
  }

}
