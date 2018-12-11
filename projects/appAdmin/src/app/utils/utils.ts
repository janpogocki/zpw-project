import {Product} from '../../../../../src/app/product/product';
import {CartUtils} from '../../../../../src/app/utils/cart-utils';

export const getReadableProducts = (products: any[], db: Product[]): string[] => {
  const returnedArray = [];

  for (const product of products) {
    const current = db[CartUtils.getProductIndexById(product.id, db)];
    returnedArray.push(current.name + ' (' + product.quantity + 'x)');
  }

  return returnedArray;
};
