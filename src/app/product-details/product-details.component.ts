import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: product | undefined;
  productQuantity: number = 1;
  cartData: cart | undefined;
  cartItems: cart[] = [];
  addCart: boolean = true;
  removeBtn: boolean = false;
  loadingBtn: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    productId && this.getSelectedProduct(productId);
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).userId;
    this.product.getCartItems().subscribe((carts) => {
      if (carts) {
        this.cartItems = carts;
        let userCart = carts.filter((cart) => {
          return cart.userId == userId
        })
        let cartProduct = userCart.filter((item) => {
          return item.productId?.toString() == productId;
        });
        if (cartProduct.length) {
          this.removeBtn = true;
          this.addCart = false;
        } else {
          this.removeBtn = false;
          this.addCart = true;
        }
      }
    });

  };

  getSelectedProduct(productId: string) {
    productId && this.product.getAllProducts().subscribe((result) => {
      let stringArray = JSON.stringify(result);
      let parseArray = JSON.parse(stringArray);
      let product = parseArray.filter((product: any) => {
        return product.id == productId;
      });
      this.productData = product[0];
      this.cartData = product[0];
    });
  }

  buyProduct(productId: number) {
    let user = localStorage.getItem('user');
    if (user) {
      if (this.productData) {
        let userId = JSON.parse(user).userId;
        let productId = this.productData.id;
        delete this.productData.sellerId;
        let buyProduct: cart = {
          ...this.productData,
          userId,
          productId,
          quantity: this.productQuantity,
          loading: false
        }
        delete buyProduct.id;
        localStorage.setItem('buyProduct', JSON.stringify(buyProduct));
        this.router.navigate(['checkout']);
      }
    } else {
      localStorage.setItem('productId', JSON.stringify(productId));
      this.router.navigate(['user-auth']);
    }
  }

  addToCart(productId: number) {
    this.loadingBtn = true;
    this.addCart = false;

    this.product.getCartItems().subscribe((carts) => {
      if (carts) {
        this.cartItems = carts;
      }
      let user = localStorage.getItem('user');
      if (user) {
        if (this.productData) {
          let userId = JSON.parse(user).userId;
          let productId = this.productData.id;
          delete this.productData.sellerId;
          let cartData: cart = {
            ...this.productData,
            userId,
            productId,
            quantity: this.productQuantity,
            loading: false
          }
          delete cartData.id;
          this.cartItems.push(cartData);
          this.product.addToCart(this.cartItems).subscribe((result) => {
            if (result) {
              this.product.getUserCartLength();
              this.loadingBtn = false;
              this.removeBtn = true;
            }
          })
        }
      } else {
        localStorage.setItem('productId', JSON.stringify(productId));
        this.router.navigate(['user-auth']);
      }
    });
  }

  removeToCart() {
    this.loadingBtn = true;
    this.removeBtn = false;

    this.product.getCartItems().subscribe((carts) => {
      if (carts) {
        let remainCartItems = carts.filter((item) => {
          return item.productId !== this.cartData?.id
        });
        this.product.addToCart(remainCartItems).subscribe(() => {
          this.product.getUserCartLength();
          this.loadingBtn = false;
          this.addCart = true;
          this.cartItems = [];
        });
      }
    });

  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

}
