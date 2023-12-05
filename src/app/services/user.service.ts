import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { userSignUp, login } from '../data-type';
import { Router } from '@angular/router';
import { baseUrl } from 'app/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isloginError = new EventEmitter<boolean>(false);
  userData: userSignUp[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(data: userSignUp[]) {
    return this.http.put(`${baseUrl}/users.json`, data, { observe: 'response' }).subscribe((result) => {
      if (result && result.body) {
        localStorage.setItem('user', JSON.stringify(data[data.length - 1]))
        this.router.navigate(['/']);
      }
    });
  }

  getUsers() {
    return this.http.get(`${baseUrl}/users.json`)
  }

  reloadUser() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/'])
    }
  }

  userlogin(data: login) {
    return this.http.get(`${baseUrl}/users.json`, { observe: 'response' }).subscribe((result: any) => {
      if (result && result.body.length) {
        let userLogin = result.body.filter((user: any) => {
          return data.email == user.email && data.password == user.password;
        });
        if (userLogin.length) {
          localStorage.setItem('user', JSON.stringify(userLogin[0]));
          this.isloginError.emit(false)

          let productId = localStorage.getItem('productId');
          if (productId) {
            this.router.navigate([`details/${productId}`]);
            localStorage.removeItem('productId')
          } else {
            this.router.navigate(['/']);
          }

        } else {
          this.isloginError.emit(true)
        }
      }
    });
  }

}


