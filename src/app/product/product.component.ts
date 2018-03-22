import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { IProduct } from '../services/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private _productService: ProductService, private _router: Router) { }
  insertStatus = false;
  statusMessage = 'Product Added Successfully';

  ngOnInit() {
  }

  addNewProduct(productForm: NgForm) {
    // console.log('Data ' + JSON.stringify(productForm.value));
    this._productService.addProduct(productForm.value)
      .subscribe(
        status => this.success(status),
        error => this.errorFunction(error)
      );
  }

  private success(status) {
    if (status) {
      this.insertStatus = true;
      console.log('Added');
      return;
    } else {
      console.log('Error');
    }
  }

  private gotoProducts() {
    this._router.navigate(['/products']);
  }

  private errorFunction(msg) {
    console.log(msg);
  }

}
