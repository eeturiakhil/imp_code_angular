import { Component, OnInit } from '@angular/core';

import { ProductService } from '../services/product.service';
import { IProduct } from '../services/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: IProduct[] = [];
  // id: number;
  errorMessage: string;
  constructor(private _productService: ProductService) { }

  ngOnInit() {
    this.fetchAllData();
  }

  fetchAllData() {
    this._productService.fetchData()
      .subscribe(
        products => this.products = products,
        error => this.errorMessage = <any>error
      );
  }

  deleteProduct(id) {
    if (confirm('Are you sure? ')) {
      this._productService.deleteProduct(id)
        .subscribe(
          status => this.success(status),
          error => this.errorFunction(error)
        );
      // const url = `${'http://localhost:5555/products'}/${id}`;
      // return
    }
  }

  private success(status) {
    if (status) {
      console.log('Deleted');
      this.fetchAllData();
    } else {
      console.log('Error');
    }
  }

  private errorFunction(msg) {
    console.log(msg);
  }

}
