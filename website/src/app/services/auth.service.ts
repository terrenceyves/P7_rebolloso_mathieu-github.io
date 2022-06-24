import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, tap} from 'rxjs';
import {Router} from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isAuth$ = new BehaviorSubject<boolean>(false);
  //On dit que isAdmin est un boolean afin de checker si l'utilisateur est admin ou non
  isAdmin$ = new BehaviorSubject<boolean>(false);
  private authToken = '';
  private userId = '';

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(email: string, password: string) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/auth/signup', {email: email, password: password});
  }

  isAdmin() {
    //On créer l'objet du JWT afin de le décoder et de séléctionner la clé que l'ont veut
    type JWTDeCode  = {
      admin: boolean,
      ext: number,
      iat: number,
      userId: string
    }

    //On decode le jwt
    const decoded : JWTDeCode = jwt_decode(this.getToken());

    //Si admin = true alors l'utilisateur est admin sinon non
    if (decoded.admin) {
      this.isAdmin$.next(true);
    } else {
      this.isAdmin$.next(false);
    }
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }

  loginUser(email: string, password: string) {
    return this.http.post<{ userId: string, token: string }>('http://localhost:3000/api/auth/login', {email: email, password: password}).pipe(
      tap(({ userId, token }) => {
        this.userId = userId;
        this.authToken = token;
        this.isAuth$.next(true);
        this.isAdmin();
      })
    );
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.isAuth$.next(false);
    this.router.navigate(['login']);
  }

}
