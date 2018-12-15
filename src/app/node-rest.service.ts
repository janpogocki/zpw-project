import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from './product/product';

@Injectable({
  providedIn: 'root'
})
export class NodeRestService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/products');
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<Product>(this.apiUrl + '/product/' + id);
  }

  getDiscounts(): Observable<any> {
    return this.http.get(this.apiUrl + '/discounts');
  }

  getOrders(): Observable<any> {
    return this.http.get(this.apiUrl + '/orders');
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
