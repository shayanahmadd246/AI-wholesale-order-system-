import { Product, Client, Supplier, Order, PaymentRecord, AIActivityLog, ChatMessage, AdminUser } from '../types';

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Shayan Admin',
    email: 'shayan@gmail.com',
    phone: '+92 300 0000000',
    role: 'admin',
    status: 'Active',
    createdDate: '2025-01-01',
    password: 's123456'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Khan Muhammad',
    shopName: 'Peshawar City Wholesale & Retail Store',
    phone: '+92 300 5550192',
    cnicNumber: '17301-5550192-1',
    password: 'khan123',
    city: 'Peshawar',
    address: 'Karkhano Market, Gate #3, Jamrud Road, Peshawar',
    language: 'ps',
    totalDues: 45200,
    creditLimit: 150000,
    status: 'Active',
    joinedDate: '2025-01-15'
  },
  {
    id: 'cli-2',
    name: 'Tariq Mehmood',
    shopName: 'Madina Super Store',
    phone: '+92 321 4441029',
    cnicNumber: '35202-4441029-3',
    password: 'tariq123',
    city: 'Lahore',
    address: 'Shop #14, Akbari Mandi Wholesale Market, Lahore',
    language: 'ur',
    totalDues: 18500,
    creditLimit: 100000,
    status: 'Active',
    joinedDate: '2025-02-01'
  },
  {
    id: 'cli-3',
    name: 'Gul Zaman Swati',
    shopName: 'Swat Valley Grocery',
    phone: '+92 333 8882011',
    cnicNumber: '15602-8882011-5',
    password: 'swat123',
    city: 'Mingora',
    address: 'Main Bazaar, Near Green Chowk, Mingora Swat',
    language: 'ps',
    totalDues: 0,
    creditLimit: 80000,
    status: 'Active',
    joinedDate: '2025-03-10'
  },
  {
    id: 'cli-4',
    name: 'Bilal Ahmed',
    shopName: 'Al-Rehman Traders',
    phone: '+92 312 9993344',
    cnicNumber: '37405-9993344-7',
    password: 'bilal123',
    city: 'Rawalpindi',
    address: 'Ganj Mandi, Rawalpindi',
    language: 'en',
    totalDues: 112000,
    creditLimit: 100000,
    status: 'Blocked',
    joinedDate: '2024-11-20'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Haji Sharbat Khan',
    companyName: 'Khyber Agri Foods Ltd',
    phone: '+92 301 7772211',
    email: 'Khyber.agri@wholesale.pk',
    password: 'khyber123',
    category: 'Grains & Pulses',
    status: 'Active',
    permissions: {
      canChangePrices: true,
      canChangeStock: true
    },
    totalSales: 485000,
    pendingPayout: 38200,
    hiredDate: '2025-01-10'
  },
  {
    id: 'sup-2',
    name: 'Malik Zafar',
    companyName: 'Indus Edible Oils & Ghee',
    phone: '+92 322 6664411',
    email: 'Indus.oil@wholesale.pk',
    password: 'indus123',
    category: 'Oils & Ghee',
    status: 'Active',
    permissions: {
      canChangePrices: false,
      canChangeStock: true
    },
    totalSales: 310000,
    pendingPayout: 22400,
    hiredDate: '2025-02-01'
  },
  {
    id: 'sup-3',
    name: 'Subhanullah Shinwari',
    companyName: 'Peshawar Wholesale Tea Importers',
    phone: '+92 334 1119988',
    email: 'shinwari.tea@wholesale.pk',
    password: 'shinwari123',
    category: 'Beverages',
    status: 'Active',
    permissions: {
      canChangePrices: true,
      canChangeStock: true
    },
    totalSales: 240000,
    pendingPayout: 15800,
    hiredDate: '2025-02-18'
  },
  {
    id: 'sup-4',
    name: 'Shahid Iqbal',
    companyName: 'Al-Hidayah Hygiene & FMCG',
    phone: '+92 315 3337722',
    email: 'alhidayah@fcmg.pk',
    password: 'alhidayah123',
    category: 'Hygiene & FMCG',
    status: 'Active',
    permissions: {
      canChangePrices: true,
      canChangeStock: true
    },
    totalSales: 98000,
    pendingPayout: 8400,
    hiredDate: '2025-03-05'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Super Kernel Basmati Rice (50kg Bag)',
    nameUrdu: 'سوپر کرنل باستمى چاول (50 کلو)',
    namePashto: 'سوپر کرنل باسطي وريجې (50 کلو)',
    supplierId: 'sup-1',
    supplierName: 'Khyber Agri Foods Ltd',
    category: 'Grains & Pulses',
    unit: '50kg Bag',
    wholesalePrice: 12500,
    costPrice: 10800,
    stock: 140,
    minOrderQty: 2,
    lowStockThreshold: 20,
    description: 'A-grade long grain double polished basmati rice.'
  },
  {
    id: 'prod-2',
    name: 'Fine White Wheat Flour (20kg Bag)',
    nameUrdu: 'فائن فلوٹ گندم آٹا (20 کلو)',
    namePashto: 'ملايم سپين غنم اوړه (20 کلو)',
    supplierId: 'sup-1',
    supplierName: 'Khyber Agri Foods Ltd',
    category: 'Flour & Grains',
    unit: '20kg Bag',
    wholesalePrice: 2250,
    costPrice: 1950,
    stock: 18,
    minOrderQty: 5,
    lowStockThreshold: 30,
    description: 'Chakki fresh premium fine white flour.'
  },
  {
    id: 'prod-3',
    name: 'Pure Cooking Oil (16 Litre Tin)',
    nameUrdu: 'خالص کوکنگ آئل (16 لیٹر ٹن)',
    namePashto: 'خالص پخولو تېل (16 ليټر ډبه)',
    supplierId: 'sup-2',
    supplierName: 'Indus Edible Oils & Ghee',
    category: 'Oils & Ghee',
    unit: '16L Tin',
    wholesalePrice: 8800,
    costPrice: 7600,
    stock: 85,
    minOrderQty: 1,
    lowStockThreshold: 15,
    description: 'Triple refined vitamin enriched vegetable cooking oil.'
  },
  {
    id: 'prod-4',
    name: 'Banaspati Ghee Carton (12 x 1kg)',
    nameUrdu: 'بناسپتی گھی کارٹن (12 x 1 کلو)',
    namePashto: 'بناسپتي ګېو کارټن (12 x 1 کلو)',
    supplierId: 'sup-2',
    supplierName: 'Indus Edible Oils & Ghee',
    category: 'Oils & Ghee',
    unit: 'Carton (12kg)',
    wholesalePrice: 6600,
    costPrice: 5700,
    stock: 60,
    minOrderQty: 1,
    lowStockThreshold: 10,
    description: 'Premium aromatic banaspati ghee.'
  },
  {
    id: 'prod-5',
    name: 'Kenya Premium Black Tea (500g x 24 Pack Carton)',
    nameUrdu: 'کینیا پریمیم بلیک ٹی (24 پیک کارٹن)',
    namePashto: 'کينيا کليواله توره چاى (24 پيک کارټن)',
    supplierId: 'sup-3',
    supplierName: 'Peshawar Wholesale Tea Importers',
    category: 'Beverages',
    unit: 'Carton (12kg)',
    wholesalePrice: 18500,
    costPrice: 16200,
    stock: 42,
    minOrderQty: 1,
    lowStockThreshold: 8,
    description: 'Strong Danedar Kenya black tea blend.'
  },
  {
    id: 'prod-6',
    name: 'Refined White Sugar (50kg Sack)',
    nameUrdu: 'ریفائنڈ وائٹ شوگر (50 کلو)',
    namePashto: 'سپينه چيني (50 کلو بورۍ)',
    supplierId: 'sup-1',
    supplierName: 'Khyber Agri Foods Ltd',
    category: 'Sugar & Sweets',
    unit: '50kg Sack',
    wholesalePrice: 7200,
    costPrice: 6500,
    stock: 210,
    minOrderQty: 2,
    lowStockThreshold: 25,
    description: 'Crystal white high purity refined sugar.'
  },
  {
    id: 'prod-7',
    name: 'Red Lentils / Daal Masoor (25kg Bag)',
    nameUrdu: 'دال مسور (25 کلو بوری)',
    namePashto: 'دال مسور (25 کلو بورۍ)',
    supplierId: 'sup-1',
    supplierName: 'Khyber Agri Foods Ltd',
    category: 'Grains & Pulses',
    unit: '25kg Bag',
    wholesalePrice: 6400,
    costPrice: 5500,
    stock: 4,
    minOrderQty: 1,
    lowStockThreshold: 10,
    description: 'Polished split red lentils.'
  },
  {
    id: 'prod-8',
    name: 'Antiseptic Soap Bar Carton (72 Pieces)',
    nameUrdu: 'اینٹی سیپٹک صابن کارٹن (72 عدد)',
    namePashto: 'صحي صابون کارټن (72 دانې)',
    supplierId: 'sup-4',
    supplierName: 'Al-Hidayah Hygiene & FMCG',
    category: 'Personal Care & Hygiene',
    unit: 'Carton (72pcs)',
    wholesalePrice: 4200,
    costPrice: 3400,
    stock: 95,
    minOrderQty: 1,
    lowStockThreshold: 12,
    description: '115g antibacterial protection soap.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-1001',
    clientId: 'cli-1',
    clientName: 'Khan Muhammad',
    clientShop: 'Peshawar City Wholesale & Retail Store',
    clientPhone: '+92 300 5550192',
    status: 'Out for delivery',
    items: [
      {
        productId: 'prod-1',
        productName: 'Super Kernel Basmati Rice (50kg Bag)',
        quantity: 2,
        unit: '50kg Bag',
        unitPrice: 12500,
        unitCost: 10800,
        totalPrice: 25000
      },
      {
        productId: 'prod-3',
        productName: 'Pure Cooking Oil (16 Litre Tin)',
        quantity: 2,
        unit: '16L Tin',
        unitPrice: 8800,
        unitCost: 7600,
        totalPrice: 17600
      }
    ],
    totalAmount: 42600,
    supplierIds: ['sup-1', 'sup-2'],
    createdAt: '2026-10-07T14:30:00.000Z',
    deliveryAddress: 'Karkhano Market, Gate #3, Jamrud Road, Peshawar',
    paymentStatus: 'Unpaid',
    notes: 'Urgent delivery requested before 5 PM.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-1002',
    clientId: 'cli-2',
    clientName: 'Tariq Mehmood',
    clientShop: 'Madina Super Store',
    clientPhone: '+92 321 4441029',
    status: 'Packed',
    items: [
      {
        productId: 'prod-5',
        productName: 'Kenya Premium Black Tea (24 Pack Carton)',
        quantity: 1,
        unit: 'Carton (12kg)',
        unitPrice: 18500,
        unitCost: 16200,
        totalPrice: 18500
      }
    ],
    totalAmount: 18500,
    supplierIds: ['sup-3'],
    createdAt: '2026-10-07T16:10:00.000Z',
    deliveryAddress: 'Shop #14, Akbari Mandi Wholesale Market, Lahore',
    paymentStatus: 'Paid',
    notes: 'Paid via direct bank deposit.'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-1003',
    clientId: 'cli-3',
    clientName: 'Gul Zaman Swati',
    clientShop: 'Swat Valley Grocery',
    clientPhone: '+92 333 8882011',
    status: 'Delivered',
    items: [
      {
        productId: 'prod-2',
        productName: 'Fine White Wheat Flour (20kg Bag)',
        quantity: 10,
        unit: '20kg Bag',
        unitPrice: 2250,
        unitCost: 1950,
        totalPrice: 22500
      },
      {
        productId: 'prod-6',
        productName: 'Refined White Sugar (50kg Sack)',
        quantity: 2,
        unit: '50kg Sack',
        unitPrice: 7200,
        unitCost: 6500,
        totalPrice: 14400
      }
    ],
    totalAmount: 36900,
    supplierIds: ['sup-1'],
    createdAt: '2026-10-06T10:15:00.000Z',
    deliveryAddress: 'Main Bazaar, Near Green Chowk, Mingora Swat',
    paymentStatus: 'Paid'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    type: 'text',
    content: 'السلام علیکم خان صاحب! زه ستاسو AI وائس او ټیکسټ اسسټنټ یم. نن تاسو ته څه شی پکار دی؟\n(Assalam-o-Alaikum Khan Sahib! I am your AI assistant. What wholesale supplies do you need today?)',
    timestamp: '10:00 AM',
    language: 'ps'
  },
  {
    id: 'msg-2',
    sender: 'user',
    type: 'voice',
    content: '🎤 Voice Note (0:08s)',
    audioUrl: 'mock-audio',
    voiceDuration: 8,
    transcription: 'سلام وروره! ما ته ۲ بوری باسطي وريجې او ۲ ډبې کوکنگ ائل پکار دي پېښور دوکان ته.',
    timestamp: '10:01 AM',
    language: 'ps'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    type: 'text',
    content: 'ما ستاسو آواز پوه شو: ۲ بوری باسطي وريجې او ۲ ډبې کوکنگ ائل. ما ستاسو آرډر تیار کړی دی، هیله ده تصدیق یې کړئ:',
    timestamp: '10:01 AM',
    language: 'ps'
  },
  {
    id: 'msg-4',
    sender: 'ai',
    type: 'order_card',
    content: 'Draft Order generated',
    orderDraft: {
      id: 'ord-1001',
      items: [
        {
          productId: 'prod-1',
          productName: 'Super Kernel Basmati Rice (50kg Bag)',
          quantity: 2,
          unit: '50kg Bag',
          unitPrice: 12500,
          unitCost: 10800,
          totalPrice: 25000
        },
        {
          productId: 'prod-3',
          productName: 'Pure Cooking Oil (16 Litre Tin)',
          quantity: 2,
          unit: '16L Tin',
          unitPrice: 8800,
          unitCost: 7600,
          totalPrice: 17600
        }
      ],
      totalAmount: 42600,
      deliveryAddress: 'Karkhano Market, Gate #3, Jamrud Road, Peshawar',
      confirmed: true
    },
    timestamp: '10:02 AM',
    language: 'ps'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    partyId: 'cli-2',
    partyName: 'Tariq Mehmood (Madina Super Store)',
    partyRole: 'client',
    type: 'ClientPayment',
    amount: 18500,
    method: 'Bank Transfer',
    reference: 'MZN-88392102',
    date: '2026-10-07',
    status: 'Completed'
  },
  {
    id: 'pay-2',
    partyId: 'sup-1',
    partyName: 'Khyber Agri Foods Ltd',
    partyRole: 'supplier',
    type: 'SupplierPayout',
    amount: 50000,
    method: 'Bank Transfer',
    reference: 'PAYOUT-2026-092',
    date: '2026-10-05',
    status: 'Completed'
  }
];

export const INITIAL_AI_LOGS: AIActivityLog[] = [
  {
    id: 'log-101',
    action: 'Voice Order Processed',
    actor: 'Khan Muhammad (Shopkeeper)',
    role: 'client',
    details: 'Processed 8s Pashto voice note. Transcribed items: 2x Basmati Rice 50kg, 2x Cooking Oil 16L.',
    timestamp: '2026-10-07 10:01 AM',
    language: 'ps'
  },
  {
    id: 'log-102',
    action: 'Order Card Drafted',
    actor: 'AI Assistant',
    role: 'system',
    details: 'Calculated total PKR 42,600 for Order #ORD-1001. Checked stock availability across 2 suppliers.',
    timestamp: '2026-10-07 10:02 AM',
    language: 'ps'
  },
  {
    id: 'log-103',
    action: 'Low Stock Alert Triggered',
    actor: 'Inventory Monitor',
    role: 'system',
    details: 'Red Lentils / Daal Masoor dropped to 4 units (Threshold: 10). Notified supplier Khyber Agri Foods Ltd.',
    timestamp: '2026-10-07 11:30 AM',
    language: 'en'
  },
  {
    id: 'log-104',
    action: 'Text Order Query',
    actor: 'Tariq Mehmood',
    role: 'client',
    details: 'Processed Urdu query: "1 carton Kenya tea needed for Lahore shop". Drafted Order #ORD-1002.',
    timestamp: '2026-10-07 04:08 PM',
    language: 'ur'
  }
];
