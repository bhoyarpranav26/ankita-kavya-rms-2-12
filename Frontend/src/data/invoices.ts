export interface Invoice {
  id: string;
  restaurantId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export const invoices: Invoice[] = [
  {
    id: 'inv1',
    restaurantId: '1',
    amount: 99,
    dueDate: '2024-01-01',
    status: 'paid',
    items: [
      { description: 'Premium Subscription - January 2024', amount: 99 }
    ]
  }
];