import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {ProductsProviderService} from '../../../../../src/app/products-provider.service';
import {Product} from '../../../../../src/app/product/product';
import {NodeRestService} from '../../../../../src/app/node-rest.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  products: Product[] = [];
  pendingOrders: any[] = [];
  finishedOrders: any[] = [];
  rejectedOrders: any[] = [];

  constructor(private authService: AuthService,
              private router: Router,
              private db: AngularFirestore,
              private productsProvider: ProductsProviderService,
              private nodeRest: NodeRestService) {
    if (!authService.isUserEmailLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    if (this.authService.firebaseDataLoaded === false) {
      this.authService.getFirebaseStatusDocument()
        .then((status) => {
          this.productsProvider.firebaseBackendActive = status;
          this.authService.firebaseDataLoaded = true;

          if (!this.productsProvider.firebaseBackendActive) {
            this.nodeRest.connect();
          }

          this.getData();
        });
    } else {
      this.getData();
    }
  }

  getData() {
    this.productsProvider.getProducts()
      .subscribe(products => this.products = products);

    this.productsProvider.getPendingOrders()
      .subscribe(orders => this.pendingOrders = orders);

    this.productsProvider.getFinishedOrders()
      .subscribe(orders => this.finishedOrders = orders);

    this.productsProvider.getRejectedOrders()
      .subscribe(orders => this.rejectedOrders = orders);
  }

}
