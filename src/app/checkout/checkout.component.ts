import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order, summary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  loadingBtn: boolean = false;
  orderBtn: boolean = true;
  userCartData: cart[] = [];
  userOrders: order[] = [];
  cartProductData: cart[] = [];
  buyProductData: cart | undefined;
  orderMsg: string | undefined;
  summary: summary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('buyProduct')) {
      this.buyProduct();
    } else if (localStorage.getItem('cartProducts')) {
      this.usercartProducts();
    } else {
      this.router.navigate(['/'])
    }

    this.product.getUserOrders().subscribe((orders) => {
      if (orders) {
        this.userOrders = orders;
      };
    })

  }

  buyProduct() {
    let localBuyProduct = localStorage.getItem('buyProduct');
    let buyProduct = localBuyProduct && JSON.parse(localBuyProduct);
    this.buyProductData = buyProduct;
    let price: number = 0;
    if (this.buyProductData && this.buyProductData.quantity) {
      let x = Number(this.buyProductData.price.toString().replace(/[^\d.-]/g, '')) * this.buyProductData.quantity;
      price += x;
    }
    this.summary.price = Math.floor(price);
    this.summary.discount = Math.floor(price / 500);
    this.summary.tax = Math.floor(price / 50);
    this.summary.delivery = 100;
    this.summary.total = this.summary.price - this.summary.discount + this.summary.tax + this.summary.delivery;
    localStorage.removeItem('buyProduct');
  }

  usercartProducts() {
    this.product.getCartItems().subscribe((cart) => {
      this.userCartData = cart;
      this.cartProductData = cart;

      let price: number = 0;
      this.userCartData.forEach((userCart) => {
        if (userCart.quantity) {
          let x = Number(userCart.price.toString().replace(/[^\d.-]/g, '')) * userCart.quantity;
          price += x;
        }
      })
      this.summary.price = Math.floor(price);
      this.summary.discount = Math.floor(price / 500);
      this.summary.tax = Math.floor(price / 50);
      this.summary.delivery = 100;
      this.summary.total = this.summary.price - this.summary.discount + this.summary.tax + this.summary.delivery;
      localStorage.removeItem('cartProducts');
    });
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    this.loadingBtn = true;
    this.orderBtn = false;
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).userId;

    if (this.buyProductData) {
      let productId = this.buyProductData.productId;
      let productName = this.buyProductData.name;
      let productImage = this.buyProductData.image;
      let orderId = new Date().getTime() + '_' + this.generateUniqueId();
      if (this.summary.total) {
        let orderData: order = {
          ...data,
          loading: false,
          productName,
          productImage,
          orderId,
          userId,
          productId,
          totalPrice: this.summary.total,
          id: undefined
        }
        this.userOrders.push(orderData);
        this.product.addUserOrders(this.userOrders).subscribe((result) => {
          if (result) {
            this.product.getUserCartLength();
            this.product.getUserOrdersLength();
            this.orderMsg = "Your order has been placed";
            setTimeout(() => {
              this.router.navigate(['my-orders']);
              this.orderMsg = undefined;
            }, 3000);
          }
        });
      }
    }

    if (this.cartProductData) {
      this.cartProductData.forEach((cart) => {
        let orderId = new Date().getTime() + '_' + this.generateUniqueId();
        let productId = cart.productId;
        let productName = cart.name;
        let productImage = cart.image;
        if (this.summary.total) {
          let orderData: order = {
            ...data,
            orderId,
            loading: false,
            productName,
            productImage,
            userId,
            productId,
            totalPrice: this.summary.total,
            id: undefined
          }
          this.userOrders.push(orderData);
        }
      });

      this.product.addUserOrders(this.userOrders).subscribe((result) => {
        if (result) {
          this.product.getCartItems().subscribe((result) => {
            let cartItems = result;
            if (cartItems) {
              let remainCartItems = cartItems.filter((cart) => {
                return cart.userId !== userId;
              });
              this.product.addToCart(remainCartItems).subscribe(() => {
                this.product.getUserCartLength();
                this.product.getUserOrdersLength();
                this.orderMsg = "Your order has been placed";
                setTimeout(() => {
                  this.router.navigate(['my-orders']);
                  this.orderMsg = undefined;
                }, 3000);
              });
            }
          });
        }
      });
    }

  };

  generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }


}
