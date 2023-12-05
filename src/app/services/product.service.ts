import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';
import { Router } from '@angular/router';
import { baseUrl } from 'app/config';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  orderLength = new Subject<number>();
  userCartLength = new Subject<number>();
  userOrderList = new Subject<order[]>();

  constructor(private http: HttpClient, private router: Router) { }

  addProduct(data: product[]) {
    return this.http.put(`${baseUrl}/products.json`, data);
  }

  getAllProducts() {
    return this.http.get<product[]>(`${baseUrl}/products.json`);
  }

  addToCart(cartData: cart[]) {
    return this.http.put(`${baseUrl}/cart.json`, cartData)
  }

  getCartItems() {
    return this.http.get<cart[]>(`${baseUrl}/cart.json`)
  }

  getUserCartLength() {
    return this.http.get<cart[]>(`${baseUrl}/cart.json`, { observe: 'response' }).subscribe((res) => {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).userId;
      if (res && res.body && res.body.length) {
        let userCart = res.body.filter((cart) => {
          return cart.userId == userId;
        });
        userCart && this.userCartLength.next(userCart.length);
      } else {
        this.userCartLength.next(0);
      }
    });
  }

  addUserOrders(data: order[]) {
    return this.http.put(`${baseUrl}/orders.json`, data)
  }

  getUserOrders() {
    return this.http.get<order[]>(`${baseUrl}/orders.json`)
  }

  getUserOrdersLength() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).userId;
    return this.http.get<order[]>(`${baseUrl}/orders.json`, { observe: 'response' }).subscribe((response) => {
      if (response && response.body?.length) {
        let userOrders = response.body.filter((order) => {
          return order.userId == userId;
        });
        this.userOrderList.next(userOrders);
        this.orderLength.next(userOrders.length);
      } else {
        this.orderLength.next(0);
      }
    })
  }

}
