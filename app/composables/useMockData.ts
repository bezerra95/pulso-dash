import type {
  DashboardUser,
  Order,
  Product,
  Subscription,
  Notification,
  DashboardMetrics,
  SalesDataPoint,
  ChartPeriod,
} from '~/types'

const NAMES = [
  'Ana Lima','Bruno Carvalho','Carlos Souza','Daniela Ferreira','Eduardo Santos',
  'Fernanda Costa','Gabriel Oliveira','Helena Martins','Igor Pereira','Julia Alves',
  'Kevin Rodrigues','Laura Nascimento','Marcos Gomes','Natalia Silva','Otávio Barbosa',
  'Paula Ribeiro','Rafael Mendes','Sara Castro','Thiago Freitas','Vanessa Pinto',
  'Wilson Moreira','Xuxa Tavares','Yago Correia','Zara Lopes','André Rocha',
  'Beatriz Cardoso','Cesar Araújo','Diana Melo','Enzo Vieira','Fabiana Nunes',
  'Gustavo Teixeira','Helena Ramos','Iago Cunha','Joana Batista','Leonardo Cruz',
  'Marina Azevedo','Nicolas Fonseca','Olívia Dias','Pedro Campos','Quezia Torres',
  'Ricardo Pires','Stephanie Lima','Tatiana Braga','Ulisses Coelho','Vera Andrade',
  'Wallace Machado','Ximena Siqueira','Yasmin Barros','Zeca Monteiro','Adriana Neto',
]

const PRODUCTS_NAMES = [
  'Plano Starter', 'Plano Pro', 'Plano Enterprise', 'Add-on Analytics',
  'Add-on Storage', 'Suporte Premium', 'API Access', 'White Label',
  'Training Pack', 'Migration Service', 'Custom Domain', 'SSO Integration',
  'Advanced Reports', 'Dedicated Server', 'Priority Support',
]

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2))
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)] as T
const pastDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

const generateUsers = (): DashboardUser[] =>
  NAMES.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.split(' ')[0]!.toLowerCase()}.${name.split(' ')[1]!.toLowerCase()}@email.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    role: pick(['admin', 'user', 'moderator']),
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    phone: `(${rand(11, 99)}) ${rand(90000, 99999)}-${rand(1000, 9999)}`,
    cpf: `${rand(100, 999)}.${rand(100, 999)}.${rand(100, 999)}-${rand(10, 99)}`,
    createdAt: pastDate(rand(10, 365)),
    lastLogin: pastDate(rand(0, 30)),
  }))

const ORDER_STATUSES: Order['status'][] = ['pending', 'paid', 'cancelled', 'refunded']

const generateOrders = (users: DashboardUser[]): Order[] =>
  Array.from({ length: 120 }, (_, i) => {
    const user = pick(users)
    return {
      id: `#${String(10000 + i).padStart(5, '0')}`,
      userId: user.id,
      userName: user.name,
      product: pick(PRODUCTS_NAMES),
      amount: randFloat(29.9, 1999.9),
      status: pick(ORDER_STATUSES),
      createdAt: pastDate(rand(0, 90)),
      updatedAt: pastDate(rand(0, 5)),
    }
  })

const generateProducts = (): Product[] =>
  Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: PRODUCTS_NAMES[i] ?? '',
    category: pick(['software', 'hardware', 'service', 'addon'] as Product['category'][]),
    price: randFloat(19.9, 999.9),
    stock: rand(0, 500),
    sold: rand(10, 2000),
    status: Math.random() > 0.15 ? 'active' : 'inactive',
    createdAt: pastDate(rand(30, 365)),
  }))

const generateSubscriptions = (users: DashboardUser[]): Subscription[] =>
  Array.from({ length: 40 }, (_, i) => {
    const user = users[i % users.length]!
    const plan = pick(['starter', 'pro', 'enterprise'] as Subscription['plan'][])
    const mrr = plan === 'starter' ? 29.9 : plan === 'pro' ? 99.9 : 299.9
    return {
      id: i + 1,
      userId: user.id,
      userName: user.name,
      plan,
      status: pick(['active', 'active', 'active', 'churned', 'trial'] as Subscription['status'][]),
      mrr,
      startDate: pastDate(rand(30, 365)),
      nextBilling: pastDate(-rand(1, 30)),
    }
  })

const generateNotifications = (): Notification[] => [
  { id: 1, title: 'Novo pedido', message: 'Ana Lima fez um pedido de R$ 299,90', type: 'success', read: false, createdAt: pastDate(0) },
  { id: 2, title: 'Pagamento falhou', message: 'Cartão de Bruno Carvalho recusado', type: 'error', read: false, createdAt: pastDate(0) },
  { id: 3, title: 'Assinatura cancelada', message: 'Carlos Souza cancelou o plano Pro', type: 'warning', read: false, createdAt: pastDate(1) },
  { id: 4, title: 'Novo usuário', message: 'Daniela Ferreira criou uma conta', type: 'info', read: true, createdAt: pastDate(1) },
  { id: 5, title: 'Meta atingida', message: 'MRR ultrapassou R$ 50.000 este mês', type: 'success', read: true, createdAt: pastDate(2) },
  { id: 6, title: 'Upgrade de plano', message: 'Eduardo Santos migrou para Enterprise', type: 'success', read: true, createdAt: pastDate(2) },
]

const generateSalesData = (period: ChartPeriod): SalesDataPoint[] => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: d.toISOString().split('T')[0] ?? '',
      revenue: randFloat(800, 4500),
      orders: rand(5, 45),
    }
  })
}

export const useMockData = () => {
  const users = ref<DashboardUser[]>(generateUsers())
  const orders = ref<Order[]>(generateOrders(users.value))
  const products = ref<Product[]>(generateProducts())
  const subscriptions = ref<Subscription[]>(generateSubscriptions(users.value))
  const notifications = ref<Notification[]>(generateNotifications())
  const salesData = ref<SalesDataPoint[]>(generateSalesData('30d'))

  const metrics = reactive<DashboardMetrics>({
    revenue: randFloat(42000, 68000),
    revenueChange: randFloat(-5, 18),
    orders: rand(320, 580),
    ordersChange: randFloat(-3, 22),
    users: users.value.filter((u) => u.status === 'active').length,
    usersChange: randFloat(2, 15),
    churnRate: randFloat(1.2, 4.8),
    churnChange: randFloat(-2, 1.5),
    mrr: subscriptions.value.filter((s) => s.status === 'active').reduce((acc, s) => acc + s.mrr, 0),
    arr: 0,
  })
  metrics.arr = metrics.mrr * 12

  const updateSalesData = (period: ChartPeriod) => {
    salesData.value = generateSalesData(period)
  }

  let realtimeTimer: ReturnType<typeof setInterval> | null = null

  const startRealtime = () => {
    if (!import.meta.client) return
    realtimeTimer = setInterval(() => {
      metrics.revenue += randFloat(-150, 350)
      metrics.orders += rand(0, 2)
      metrics.users += rand(0, 1)
      metrics.churnRate = Math.max(0.5, metrics.churnRate + randFloat(-0.1, 0.1))
      metrics.mrr += randFloat(-50, 120)
      metrics.arr = metrics.mrr * 12

      if (Math.random() > 0.7) {
        const user = pick(users.value)
        notifications.value.unshift({
          id: Date.now(),
          title: pick(['Novo pedido', 'Upgrade', 'Novo usuário']),
          message: `${user.name} — ação registrada`,
          type: pick(['success', 'info', 'success']),
          read: false,
          createdAt: new Date().toISOString(),
        })
        if (notifications.value.length > 20) notifications.value.pop()
      }
    }, 5000)
  }

  const stopRealtime = () => {
    if (realtimeTimer) clearInterval(realtimeTimer)
  }

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  const markAllRead = () => {
    notifications.value.forEach((n) => (n.read = true))
  }

  return {
    users,
    orders,
    products,
    subscriptions,
    notifications,
    salesData,
    metrics,
    unreadCount,
    updateSalesData,
    startRealtime,
    stopRealtime,
    markAllRead,
  }
}
