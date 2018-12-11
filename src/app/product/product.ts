export class Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string;
  photo: string;
  category: string;

  oldPrice: number;
  discountTimeout: number;
  discountPercentage: number;
}
