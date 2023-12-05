import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, summary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cartData: cart[] | undefined;
  summary: summary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.userCartItems();
  }

  userCartItems() {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).userId;
    if (userId) {
      this.product.getCartItems().subscribe((result) => {
        let cartItems = result;
        if (cartItems) {
          let userCart = cartItems.filter((cart) => {
            return cart.userId == userId
          })
          this.cartData = userCart;
          localStorage.setItem('cartProducts', JSON.stringify(this.cartData))
        } else {
          this.router.navigate(['/']);
        }
      })
    }
  }

  removeToCart(cart: cart) {
    cart.loading = true;
    if (cart.productId) {
      this.product.getCartItems().subscribe((allCartItems) => {
        let remainCartItems = allCartItems.filter((item) => {
          return item.productId !== cart.productId;
        });
        localStorage.setItem('cartProducts', JSON.stringify(remainCartItems))
        this.product.addToCart(remainCartItems).subscribe(() => {
          this.product.getUserCartLength();
          this.userCartItems();
        });
      });
    }
  }

  checkout() {
    this.router.navigate(['checkout']);
  }

}
