import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HelloComponent } from './hello/hello.component';
import { ProductsComponent } from './products/products.component';
import {AppComponent} from './app.component';
import { NaglowekComponent } from './naglowek/naglowek.component';
import { ProductComponent } from './product/product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {environment} from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ProductsComponent,
    NaglowekComponent,
    ProductComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [NaglowekComponent]
})
export class AppModule { }
