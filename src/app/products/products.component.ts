import {Component, OnInit} from '@angular/core';
import {Product} from '../product/product';
import {ProductsProviderService} from '../products-provider.service';
import {PageEvent} from '@angular/material';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  products: Product[];
  productsCopy: Product[];
  productsCopyPaginator: Product[];

  categories: string[];

  searchQuery = '';
  sortOption = 'a123';
  categoryOption = 'all';

  // paginator
  paginatorLength = 0;
  paginatorPageSize = 8;
  paginatorPageSizeOptions: number[] = [4, 8, 40, 100];

  // slider
  sliderValue = 0;
  sliderHighValue = 100;
  sliderOptions: Options = {
    floor: 0,
    ceil: 100
  };

  constructor(private productsProvider: ProductsProviderService) {
    this.products = [];
    this.productsCopy = [];
    this.productsCopyPaginator = [];

    this.categories = [];
  }

  ngOnInit(): void {
   this.productsProvider.getProducts()
      .subscribe((products: Product[]) => {
        this.products = products;

        this.setCategoryValues();
        this.setSliderValues();
        this.doFilter();
      });
  }

  doFilter() {
    this.productsCopy = [...this.products];
    this.productsCopy = this.productsCopy
      .filter(product => this.haveToShowProduct(product))
      .sort((a, b) => this.getSortFunction(a, b));

    this.paginatorLength = this.productsCopy.length;
    this.doPaginatorFilter(null);
  }

  doPaginatorFilter(event: PageEvent) {
    if (event === null) {
      this.productsCopyPaginator = this.productsCopy.slice(0, this.paginatorPageSize);
    } else {
      this.productsCopyPaginator = this.productsCopy
        .slice(event.pageIndex * event.pageSize, (event.pageIndex * event.pageSize) + event.pageSize);
    }
  }

  updateSearchQuery(searchQuery: string) {
    this.searchQuery = searchQuery;
    this.doFilter();
  }

  private getSortFunction(a: Product, b: Product): number {
    if (this.sortOption === 'a123') {
      if (a.name > b.name) {return 1; }
      if (a.name < b.name) {return -1; }
      return 0;
    }

    if (this.sortOption === 'a321') {
      if (a.name > b.name) {return -1; }
      if (a.name < b.name) {return 1; }
      return 0;
    }

    if (this.sortOption === 'c123') {
      if (a.price > b.price) {return 1; }
      if (a.price < b.price) {return -1; }
      return 0;
    }

    if (this.sortOption === 'c321') {
      if (a.price > b.price) {return -1; }
      if (a.price < b.price) {return 1; }
      return 0;
    }
  }

  private haveToShowProduct(product: Product): boolean {
    if (product.name.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      && product.price >= this.sliderValue && product.price <= this.sliderHighValue
      && (product.category === this.categoryOption || this.categoryOption === 'all')) {
      return true;
    }

    return false;
  }

  private setCategoryValues() {
    for (const product of this.products) {
      if (!this.categories.includes(product.category)) {
        this.categories.push(product.category);
      }
    }
  }

  private setSliderValues() {
    let lowest = this.products[0];
    let highest = this.products[0];

    for (const product of this.products) {
      if (product.price < lowest.price) {
        lowest = product;
      } else if (product.price > highest.price) {
        highest = product;
      }
    }

    this.sliderValue = lowest.price;
    this.sliderHighValue = highest.price;
    this.sliderOptions = {
      floor: lowest.price,
      ceil: highest.price
    };
  }
}
