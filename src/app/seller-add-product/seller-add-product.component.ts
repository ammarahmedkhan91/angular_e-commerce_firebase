import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent {

  products: product[] = [];
  addProductMessage: string | undefined;
 
  constructor(private productService: ProductService, private router: Router) { 
    this.productService.getAllProducts().subscribe((product) => {
      if (product !== null) {      
        this.products = product;
      }
    })
  }

  submit(productData: product) {
    
    let seller = localStorage.getItem('seller');
    let sellerId = seller && JSON.parse(seller).sellerId;
    productData.id = Number(new Date());
    productData.sellerId = sellerId;
    this.products.push(productData);
    this.productService.addProduct(this.products).subscribe((result) => {
      if (result) {
        this.addProductMessage = "Product is successfully added"
      }
      setTimeout(() => {
        this.addProductMessage = undefined;
        this.router.navigate(['seller-home']);
      }, 2000);
    });

  }

}
