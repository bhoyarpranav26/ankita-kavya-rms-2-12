export interface Subscription {
  id: string;
  restaurantId: string;
  tier: 'basic' | 'premium' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export const subscriptions: Subscription[] = [
  {
    id: 'sub1',
    restaurantId: '1',
    tier: 'premium',
    price: 99,
    billingCycle: 'monthly',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    status: 'active'
  }
];