import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  popularProducts: product[] = [];
  allProducts: product[] = [];
  page: number = 1;
  itemsPerPage: number = 4;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((response) => {
      if (response) {
        response.forEach((product, index) => {
          if (product !== null && index <= 2) {
            this.popularProducts.push(product)
          }
        })
        this.allProducts = response
      }
    });
  }
} 
