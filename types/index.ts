export interface Expense {
  id: string;
  amount: number;
  description: string;
  paidBy: string;
  date: string;
  time: string;
  location?: string;
  billRef?: string;
  perPersonCost: number;
  qrSource?: string;
  autoFilled: boolean;
}

export interface Balance {
  [memberName: string]: number;
}

export interface QRData {
  shopName: string | null;
  amount: number | null;
  merchantUPI: string | null;
  billRef: string | null;
  hasAmount: boolean;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface QRExpenseData {
  description?: string;
  merchant?: string | null;
  location?: string;
  billRef?: string | null;
  amount?: number;
  hasAmount?: boolean;
  qrType?: string;
  autoFilled?: boolean;
  qrSource?: string;
  paidBy?: string;
}

// ✅ New interfaces for dynamic members
export interface Member {
  id: string;
  name: string;
  isActive: boolean;
}
