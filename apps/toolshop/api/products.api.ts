import type { ApiClient } from './api-client';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  list(page = 1) {
    return this.client.get('/products', { page });
  }

  search(term: string) {
    return this.client.get('/products/search', { q: term });
  }

  byId(id: string) {
    return this.client.get(`/products/${id}`);
  }

  async listJson(page = 1): Promise<Paginated<Product>> {
    return this.client.json<Paginated<Product>>(await this.list(page));
  }

  async searchJson(term: string): Promise<Paginated<Product>> {
    return this.client.json<Paginated<Product>>(await this.search(term));
  }

  async byIdJson(id: string): Promise<Product> {
    return this.client.json<Product>(await this.byId(id));
  }

  async first(): Promise<Product> {
    const { data } = await this.listJson(1);
    return data[0];
  }
}
