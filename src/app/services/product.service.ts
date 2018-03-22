import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable class extensions
// import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/switchMap';

import { IProduct } from './product';

@Injectable()
export class ProductService {

  baseUrl = 'http://localhost:5555/products';
  options: RequestOptions;
  headers: Headers;

  constructor(private _http: Http) {
    this.headers = new Headers({'Content-Type' : 'application/json'});
    this.options = new RequestOptions({headers: this.headers});
  }

  fetchData(): Observable<IProduct[]> {
    return this._http.get(this.baseUrl)
      .map((res: Response) => <IProduct[]>res.json())
      // .do(data => console.log(data))
      .catch(this.handleError);
  }

  addProduct(product): Observable<boolean> {
    console.log(product);
    return this._http.post(this.baseUrl, product)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProductbyId(id): Observable<IProduct> {
    return this._http.get(this.baseUrl + `/${id}`, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateProduct(product) {
    return this._http.put(this.baseUrl + `/${product.id}`, product, this.options)
       .map(this.extractData)
       .catch(this.handleError);
  }

  deleteProduct(id): Observable<boolean> {
    return this._http.delete(this.baseUrl + `/${id}`, this.options)
       .map(this.extractData)
       .catch(this.handleError);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  private handleError(error: Response) {
    console.error(error);
    let message = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(message);
  }

}
