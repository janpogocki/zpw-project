import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HelloComponent } from './hello/hello.component';
import { ProductComponent } from './product/product.component';
import {AppComponent} from './app.component';
import { NaglowekComponent } from './naglowek/naglowek.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    ProductComponent,
    NaglowekComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [ProductComponent]
})
export class AppModule { }
