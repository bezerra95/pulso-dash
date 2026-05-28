export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded'
export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'churned' | 'trial'
export type ProductCategory = 'software' | 'hardware' | 'service' | 'addon'
export type ChartPeriod = '7d' | '30d' | '90d'

export interface DashboardUser {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  status: 'active' | 'inactive'
  phone: string
  cpf: string
  createdAt: string
  lastLogin: string
}

export interface Order {
  id: string
  userId: number
  userName: string
  product: string
  amount: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  category: ProductCategory
  price: number
  stock: number
  sold: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Subscription {
  id: number
  userId: number
  userName: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  mrr: number
  startDate: string
  nextBilling: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

export interface DashboardMetrics {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  users: number
  usersChange: number
  churnRate: number
  churnChange: number
  mrr: number
  arr: number
}

export interface SalesDataPoint {
  date: string
  revenue: number
  orders: number
}
