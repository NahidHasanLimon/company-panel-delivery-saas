export const ROUTE_TITLES = {
  Dashboard: 'Dashboard',
  Deliveries: 'Deliveries',
  CreateDelivery: 'Create New Delivery',
  Orders: 'Orders',
  CreateOrder: 'Create New Order',
  Deliverymen: 'Delivery Personnel',
  DeliveryInvitations: 'Deliveryman Invitations',
  Items: 'Items',
  Customers: 'Customers',
  Analytics: 'Analytics',
  Profile: 'Profile'
}

export const OPERATIONS_NAV_ITEMS = [
  { to: '/', routeName: 'Dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { to: '/deliveries', routeName: 'Deliveries', label: 'Deliveries', icon: 'Package' },
  { to: '/orders', routeName: 'Orders', label: 'Orders', icon: 'Package' },
  { to: '/deliverymen', routeName: 'Deliverymen', label: 'Delivery Personnel', icon: 'Users' },
  { to: '/delivery-invitations', routeName: 'DeliveryInvitations', label: 'Invitations', icon: 'UserPlus' },
  { to: '/items', routeName: 'Items', label: 'Items', icon: 'Package' },
  { to: '/customers', routeName: 'Customers', label: 'Customers', icon: 'UserCheck' },
  { to: '/analytics', routeName: 'Analytics', label: 'Analytics', icon: 'TrendingUp' }
]

export const ACCOUNT_NAV_ITEMS = [
  { to: '/profile', routeName: 'Profile', label: 'Profile', icon: 'User' }
]
