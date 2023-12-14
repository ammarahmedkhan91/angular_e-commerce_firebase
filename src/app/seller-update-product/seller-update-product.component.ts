import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  productData: product | undefined;
  productId: undefined | string;
  productMessage: undefined | string;
  products: product[] | undefined;
  productIndex: number | undefined;
  updateBtn: boolean = true;
  loadingBtn: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {

    let productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.productIndex = Number(this.activatedRoute.snapshot.paramMap.get('index'));

    this.productService.getAllProducts().subscribe((result) => {
      this.products = result;
      let product = this.products && this.products.filter((product: any) => {
        return productId == product.id;
      });
      if (product) {
        this.productData = product[0];
      }
    });

  }

  submit(data: product) {
    this.updateBtn = false;
    this.loadingBtn = true;

    let seller = localStorage.getItem('seller')
    let sellerId = seller && JSON.parse(seller).sellerId;
    if (this.productData && this.products && this.productIndex !== undefined) {
      data.id = this.productData.id;
      data.sellerId = sellerId;
      this.products[this.productIndex] = data;
      this.productService.addProduct(this.products).subscribe((response) => {
        if (response) {
          this.productMessage = "Product has updated";
          setTimeout(() => {
            this.productMessage = undefined;
            this.router.navigate(['seller-home']);
          }, 2000)
        }
      })
    }
  }

}
