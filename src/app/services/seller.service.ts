import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { login, sellerSignUp } from '../data-type';
import { Router } from '@angular/router';
import { baseUrl } from 'app/config';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  isSellerLoggedIn = new EventEmitter<boolean>(false)
  isLoginError = new EventEmitter<boolean>(false)
  sellerData: sellerSignUp[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  sellerSignUp(data: sellerSignUp[]) {
    return this.http.put(`${baseUrl}/sellers.json`, data, { observe: 'response' }).subscribe((result) => {
      if (result && result.body) {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(data[data.length - 1]))
        this.router.navigate(['seller-home'])
      }
    })
  }

  getSellers() {
    return this.http.get(`${baseUrl}/sellers.json`)
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true)
      this.router.navigate(['seller-home'])
    }
  }

  sellerLogin(data: login) {
    return this.http.get(`${baseUrl}/sellers.json`).subscribe((result: any) => {
      if (result) {
        let sellerLogin = result.filter((seller: any) => {
          return seller.email == data.email && seller.password == data.password;
        });
        if (sellerLogin.length) {
          this.isSellerLoggedIn.next(true)
          localStorage.setItem('seller', JSON.stringify(sellerLogin[0]))
          this.router.navigate(['seller-home'])
        } else {
          this.isLoginError.emit(true)
        }
      }
    })
  }

}


