import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {

  productHeading: string | undefined = "Product List";
  productList: product[] | undefined;
  productMessage: string | undefined;
  trash = faTrash;
  edit = faEdit;

  constructor(private product: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.list();
  }

  list() {
    let seller = localStorage.getItem('seller');
    let sellerId = seller && JSON.parse(seller).sellerId;

    this.product.getAllProducts().subscribe((productList) => {
      if (productList) {
        let products = productList.filter((product) => {
          return product.sellerId === sellerId;
        });
        if (products.length) {
          this.productList = products;
        } else {
          this.router.navigate(['seller-add-product'])
        }
      } else {
        this.router.navigate(['seller-add-product'])
      }
    })
  };

  deleteProduct(deleteProduct: product) {
    deleteProduct.loading = true;
    this.product.getAllProducts().subscribe((result) => {
      if (result) {
        let remainProducts = result.filter((product) => {
          return product.id !== deleteProduct.id;
        });
        if (remainProducts) {
          this.product.addProduct(remainProducts).subscribe(() => {
            this.list()
            this.productMessage = 'Product Deleted';
            setTimeout(() => this.productMessage = undefined, 2000)
          })
        }
      }
    })
  }

}
