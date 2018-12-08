import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NaglowekComponent} from './naglowek/naglowek.component';
import {environment} from '../../../../src/environments/environment';
import {FormsModule} from '@angular/forms';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatDialogModule, MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Ng5SliderModule} from 'ng5-slider';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AppRoutingModule} from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NaglowekComponent,
    LoginComponent,
    ProductsComponent,
    PromotionsComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule,
    FlexLayoutModule,
    Ng5SliderModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [NaglowekComponent]
})
export class AppModule { }
