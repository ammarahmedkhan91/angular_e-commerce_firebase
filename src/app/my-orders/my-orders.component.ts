import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  userOrderList: order[] | undefined;

  constructor(private product: ProductService, public router: Router) { }

  ngOnInit(): void {
    this.product.getUserOrdersLength();

    this.product.orderLength.subscribe((order) => {
      if (order == 0) {
        this.router.navigate(['/']);
      }
    })

    this.product.userOrderList.subscribe((orderList) => {
      this.userOrderList = orderList;
    })
  }

  cancelOrder(cancelOrder:order) {
    cancelOrder.loading = true;
    this.product.getUserOrders().subscribe((response) => {
      if (response) {
        let remainOrders = response.filter((order) => {
          return order.orderId !== cancelOrder.orderId;
        });

        this.product.addUserOrders(remainOrders).subscribe((response) => {
          this.product.getUserOrdersLength();
          if (!response) {
            this.router.navigate(['/']);
          }
        });

      } else {
        this.router.navigate(['/']);
        this.product.orderLength.next(0);
      }
    })

  }

}