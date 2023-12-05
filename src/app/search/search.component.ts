import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchProduct: undefined | product[];
  searchNotFound: undefined | string;
  spinner:boolean = true;

  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query')
    if (query) {
      this.product.getAllProducts().subscribe((result) => {
        this.spinner = false;
        let searchItem = result.filter((item) => {
          let queryVal = query && query.toUpperCase()
          return queryVal && item.name.toUpperCase().match(queryVal);
        });
        this.searchProduct = searchItem;
        if (this.searchProduct.length) {
          this.searchNotFound = undefined;
        } else {
          this.searchNotFound = "Search Not Found";
        }
      })
    }
  }
}
