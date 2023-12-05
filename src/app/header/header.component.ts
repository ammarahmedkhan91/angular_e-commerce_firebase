import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faMagnifyingGlass, faCartShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  user: any = '';
  userName: string = '';
  seller: any = '';
  sellerName: string = '';
  searchResult: undefined | product[];
  searchNotFound: undefined | string;
  searchIcon = faMagnifyingGlass;
  logo = faCartShopping;
  bar = faBars;
  time = faTimes;
  cartLength: number = 0;
  orderLength = 0;

  constructor(private router: Router, private product: ProductService) { }

  ngOnInit(): void {
      this.product.userCartLength.subscribe((length) => {
        this.cartLength = length;
      });
      this.product.orderLength.subscribe((length) => {
        this.orderLength = length;
      });

    this.router.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.seller = localStorage.getItem('seller')
          let sellerData = JSON.parse(this.seller)
          this.sellerName = sellerData.fName;
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          this.user = localStorage.getItem('user')
          let userData = JSON.parse(this.user)
          this.userName = userData.fName;
          this.menuType = 'user';
        }
        else {
          this.menuType = 'default';
        }
      }
    });

  }

  sellerLogOut() {
    localStorage.removeItem('seller');
    this.router.navigate(['seller-auth'])
  }
  userLogOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('product');
    localStorage.removeItem('itemId');
    localStorage.removeItem('productItemId');
    this.router.navigate(['user-auth'])
    this.product.userCartLength.next(0);
    this.product.orderLength.next(0);
  }

  searchProducts(value: string) {
    if (value) {
      this.product.getAllProducts().subscribe((result) => {
        let searchItem = result.filter((item) => {
          let inputVal = value.toUpperCase()
          return item.name.toUpperCase().match(inputVal);
        });
        this.searchResult = searchItem;
        if (this.searchResult.length) {
          this.searchNotFound = undefined;
        } else {
          this.searchNotFound = "Search not found";
        }
      })
    }
    else {
      this.searchResult = undefined;
      this.searchNotFound = undefined;
    }
  }

  hideSearchProducts() {
    this.searchResult = undefined;
    this.searchNotFound = undefined
  }

  submitSearch(searchVal: string) {
    if (searchVal) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`search/${searchVal}`]);
      });
    }
  }

  redirectToDetails(id: number) {
    if (id) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`details/${id}`]);
      });
    }
  }

  navigateToOrderPage() {
    let user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['user-auth']);
    } else {
      if (this.orderLength > 0) {
        this.router.navigate(['my-orders']);
      }
    }
  }

  navigateToCartPage() {
    if (this.cartLength > 0) {
      this.router.navigate(['user-auth']);
    }
  }

}
