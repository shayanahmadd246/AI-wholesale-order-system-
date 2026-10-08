import { User, Role, Language, Client } from '../types';
import { getStored, setStored, KEYS, initializeStorage } from './storageHelper';
import { INITIAL_CLIENTS, INITIAL_SUPPLIERS, INITIAL_ADMINS } from './mockData';

export const loginApi = async (role: Role, identifier: string, passwordInput: string): Promise<User> => {
  initializeStorage();
  await new Promise(res => setTimeout(res, 300));

  const cleanIdent = (identifier || '').trim();
  const cleanPass = (passwordInput || '').trim();

  if (!cleanIdent || !cleanPass) {
    throw new Error('Please enter both your credentials (email/phone/name and password).');
  }

  let user: User;

  if (role === 'admin') {
    // STRICT ADMIN VALIDATION RULE
    if (cleanIdent.toLowerCase() !== 'shayan@gmail.com' || cleanPass !== 's123456') {
      throw new Error('Access Denied: Only authorized admin (shayan@gmail.com) with correct password can enter the Admin Portal.');
    }

    const admins = getStored(KEYS.ADMINS, INITIAL_ADMINS);
    const admin = admins.find(a => a.email.toLowerCase() === 'shayan@gmail.com') || {
      id: 'admin-1',
      name: 'Shayan Admin',
      email: 'shayan@gmail.com',
      phone: '+92 300 0000000'
    };

    user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      phone: admin.phone,
      companyName: 'Al-Madina AI Wholesale Central Admin',
      language: 'en'
    };
  } else if (role === 'client') {
    const clients = getStored(KEYS.CLIENTS, INITIAL_CLIENTS);
    const normalizedInputPhone = cleanIdent.replace(/[\s\-\+]/g, '');

    const client = clients.find(c => {
      const cPhone = c.phone.replace(/[\s\-\+]/g, '');
      return cPhone === normalizedInputPhone || c.phone.includes(cleanIdent) || c.name.toLowerCase() === cleanIdent.toLowerCase();
    });

    if (!client) {
      throw new Error('Client account not found with this phone number. Please click "Sign Up" to create a new client account.');
    }

    if (client.status === 'Blocked') {
      throw new Error('Your account is currently blocked by administration due to credit dues. Please contact admin.');
    }

    if (client.password && client.password !== cleanPass) {
      throw new Error('Incorrect password for this shopkeeper account.');
    }

    user = {
      id: client.id,
      name: client.name,
      role: 'client',
      phone: client.phone,
      cnicNumber: client.cnicNumber,
      shopName: client.shopName,
      language: client.language,
      clientId: client.id
    };
  } else {
    // Supplier
    const suppliers = getStored(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    const supplier = suppliers.find(s => {
      const matchEmail = s.email.toLowerCase() === cleanIdent.toLowerCase();
      const matchCompany = s.companyName.toLowerCase() === cleanIdent.toLowerCase();
      const matchName = s.name.toLowerCase() === cleanIdent.toLowerCase();
      return matchEmail || matchCompany || matchName;
    });

    if (!supplier) {
      throw new Error('Supplier account not found with this email/company name. Please verify your company details.');
    }

    if (supplier.status === 'Inactive') {
      throw new Error('Your supplier account is currently inactive.');
    }

    if (supplier.password && supplier.password !== cleanPass) {
      throw new Error('Incorrect password for this supplier partner account.');
    }

    user = {
      id: supplier.id,
      name: supplier.name,
      role: 'supplier',
      phone: supplier.phone,
      email: supplier.email,
      companyName: supplier.companyName,
      supplierId: supplier.id
    };
  }

  setStored(KEYS.USER, user);
  return user;
};

export const registerClientApi = async (data: {
  shopName: string;
  name: string;
  phone: string;
  cnicNumber: string;
  password: string;
  city?: string;
  address?: string;
}): Promise<User> => {
  initializeStorage();
  await new Promise(res => setTimeout(res, 350));

  const clients = getStored<Client[]>(KEYS.CLIENTS, INITIAL_CLIENTS);

  // Check if phone already exists
  const normalizedPhone = data.phone.replace(/[\s\-\+]/g, '');
  const existing = clients.find(c => c.phone.replace(/[\s\-\+]/g, '') === normalizedPhone);

  if (existing) {
    throw new Error('An account with this phone number already exists. Please Sign In instead.');
  }

  const newClient: Client = {
    id: `cli-${Date.now()}`,
    shopName: data.shopName.trim(),
    name: data.name.trim(),
    phone: data.phone.trim(),
    cnicNumber: data.cnicNumber.trim(),
    password: data.password.trim(),
    city: data.city || 'Peshawar',
    address: data.address || 'Main Wholesale Market',
    language: 'ps',
    totalDues: 0,
    creditLimit: 100000,
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  clients.unshift(newClient);
  setStored(KEYS.CLIENTS, clients);

  const user: User = {
    id: newClient.id,
    name: newClient.name,
    role: 'client',
    phone: newClient.phone,
    cnicNumber: newClient.cnicNumber,
    shopName: newClient.shopName,
    language: newClient.language,
    clientId: newClient.id
  };

  setStored(KEYS.USER, user);
  return user;
};

export const getCurrentUserApi = async (): Promise<User | null> => {
  initializeStorage();
  return getStored<User | null>(KEYS.USER, null);
};

export const logoutApi = async (): Promise<void> => {
  localStorage.removeItem(KEYS.USER);
};

export const updateUserLanguageApi = async (userId: string, language: Language): Promise<void> => {
  const user = getStored<User | null>(KEYS.USER, null);
  if (user) {
    user.language = language;
    setStored(KEYS.USER, user);
  }
};
