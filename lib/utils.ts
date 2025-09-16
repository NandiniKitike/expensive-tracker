import { Expense, Balance, Settlement } from '@/types';

export const calculateSplit = (amount: number, memberCount: number): number => {
  return Math.round((amount / memberCount) * 100) / 100;
};

export const updateBalances = (currentBalances: Balance, expense: Expense): Balance => {
  const updated = { ...currentBalances };
  const perPerson = expense.perPersonCost;
  
  // Person who paid gets credit for amount minus their share
  updated[expense.paidBy] += (expense.amount - perPerson);
  
  // Everyone else gets debited for their share
  Object.keys(updated).forEach(member => {
    if (member !== expense.paidBy) {
      updated[member] -= perPerson;
    }
  });
  
  return updated;
};

export const generateSettlements = (balances: Balance): Settlement[] => {
  const settlements: Settlement[] = [];
  
  const balanceEntries: [string, number][] = Object.entries(balances).map(
    ([name, amount]) => [name, amount as number]
  );
  
  const creditors = balanceEntries.filter(([_, amount]) => amount > 0);
  const debtors = balanceEntries.filter(([_, amount]) => amount < 0);
  
  creditors.forEach(([creditor]) => {
    debtors.forEach(([debtor, debtAmount]) => {
      if (Math.abs(debtAmount) > 0.01) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: Math.abs(debtAmount)
        });
      }
    });
  });
  
  return settlements;
};
