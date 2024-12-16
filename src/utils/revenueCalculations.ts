import { RAF_BASE_RATE } from './constants';

export function calculateRevenue(rafScore: number): number {
  return rafScore * RAF_BASE_RATE;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}