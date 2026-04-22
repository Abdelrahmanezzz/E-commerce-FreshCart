export interface IProductItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: string;
  brand: string;
  ratingsAverage: number;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
