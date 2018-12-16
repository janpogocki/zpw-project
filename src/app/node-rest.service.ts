import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from './product/product';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NodeRestService {

  private apiUrl = 'http://localhost:5000';
  private socket;

  constructor(private http: HttpClient) {
  }

  connect() {
    this.socket = io(this.apiUrl).connect();
  }

  getProducts(): Observable<Product[]> {
    this.http.get<Product[]>(this.apiUrl + '/products').toPromise();
    return new Observable<Product[]>(observer => this.socket.on('products', data => observer.next(data)));
  }

  getProduct(id: string): Observable<any> {
    this.http.get<Product>(this.apiUrl + '/product/' + id).toPromise();
    return new Observable<any>(observer => this.socket.on('product', data => observer.next(data)));
  }

  getDiscounts(): Observable<any> {
    this.http.get(this.apiUrl + '/discounts').toPromise();
    return new Observable<any>(observer => this.socket.on('discounts', data => observer.next(data)));
  }

  getOrders(): Observable<any> {
    this.http.get(this.apiUrl + '/orders').toPromise();
    return new Observable<any>(observer => this.socket.on('orders', data => observer.next(data)));
  }

  saveProduct(product: any): Promise<any> {
    return this.http.post<any>(this.apiUrl + '/product', product).toPromise();
  }

  saveDiscount(data: any): Promise<any> {
    return this.http.post<any>(this.apiUrl + '/discount', data).toPromise();
  }

  saveOrder(order: any): Promise<any> {
    return this.http.post<any>(this.apiUrl + '/order', order).toPromise();
  }

  updateProduct(id: string, product: any): Promise<any> {
    return this.http.patch<any>(this.apiUrl + '/product/' + id, product).toPromise();
  }

  updateOrder(id: string, data: any): Promise<any> {
    return this.http.patch<any>(this.apiUrl + '/order/' + id, data).toPromise();
  }

  removeProduct(id: string): Promise<void> {
    return this.http.delete<void>(this.apiUrl + '/product/' + id).toPromise();
  }
}
