import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HelloComponent} from './hello/hello.component';
import {ProductsComponent} from './products/products.component';
import {AppComponent} from './app.component';
import {NaglowekComponent} from './naglowek/naglowek.component';
import {ProductComponent} from './product/product.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {CartComponent} from './cart/cart.component';
import {FinalizeComponent} from './finalize/finalize.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ProductsComponent,
    NaglowekComponent,
    ProductComponent,
    ProductDetailsComponent,
    CartComponent,
    FinalizeComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [NaglowekComponent]
})
export class AppModule { }
