export interface Payment {
  id: string;
  restaurantId: string;
  amount: number;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal';
  status: 'completed' | 'pending' | 'failed';
  invoiceId?: string;
}

export const payments: Payment[] = [
  {
    id: 'pay1',
    restaurantId: '1',
    amount: 99,
    date: '2024-01-01',
    method: 'credit_card',
    status: 'completed',
    invoiceId: 'inv1'
  }
];