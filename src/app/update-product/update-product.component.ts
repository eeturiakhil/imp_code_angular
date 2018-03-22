import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from '../services/product';
import { ProductService } from '../services/product.service';



@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  productForm: FormGroup;
  id: number;
  product: IProduct = new IProduct();
  updateStatus = false;
  prodExist = false;
  statusMessage = 'Product Updated Successfully';

  constructor(private _router: Router, private _route: ActivatedRoute,
    private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      color: ['', [Validators.required]]
    });

    this._route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.productService.getProductbyId(this.id)
      .subscribe(
        status => this.fetchDataById(status),
        error => this.errorFunction(error)
      );
  }

  private fetchDataById(status) {
    if (status) {
      this.productForm.setValue({
        id: status.id,
        name: status.name,
        color: status.color
      });
    } else {
      console.log('Error');
    }
  }

  private errorFunction(msg) {
    console.log(msg);
  }

  private gotoProducts(prod) {
    this._router.navigate(['/products']);
  }

  updateProduct(product) {
    console.log(this.productForm);
    console.log('Saved: ' + JSON.stringify(this.productForm.value));

    this.productService.updateProduct(this.productForm.value)
        .subscribe(
          status => this.updatedData(status),
          error => this.errorFunction(error)
        );
  }

  private updatedData(status) {
    if (status) {
      this.updateStatus = true;
    } else {
      console.log('Error');
    }
  }

}
