export interface OrderItem {
  sku: string;
  qty: number;
  price: number;
}

export interface Customer {
  email: string;
  name: string;
}

export interface Order {
  id: string;
  externalId?: string;
  items: OrderItem[];
  customer: Customer;
  createdAt: Date;
}
