export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  adminId?: string; // ID of the admin managing this restaurant
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  subscriptionExpiry: string; // ISO date string
  status: 'active' | 'inactive' | 'suspended';
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'RestoM Main',
    address: '123 Main St, City',
    phone: '+1234567890',
    adminId: 'admin1',
    subscriptionTier: 'premium',
    subscriptionExpiry: '2025-12-31',
    status: 'active'
  }
];