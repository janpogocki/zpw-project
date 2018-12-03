import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {CartComponent} from './cart/cart.component';
import {FinalizeComponent} from './finalize/finalize.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: ProductsComponent },
  { path: 'product/details/:id', component: ProductDetailsComponent },
  { path: 'product/details', redirectTo: 'home', pathMatch: 'full'},
  { path: 'cart', component: CartComponent },
  { path: 'finalize', component: FinalizeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
