'use client';

import React from 'react';
import { Balance } from '@/types';
import { generateSettlements } from '@/lib/utils';

interface BalanceViewProps {
  balances: Balance;
}

export default function BalanceView({ balances }: BalanceViewProps): JSX.Element {
  const settlements = generateSettlements(balances);
  const totalExpenses = Object.values(balances).reduce((sum, balance) => sum + Math.abs(balance), 0) / 2;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">💰 Current Balances</h2>
        <div className="text-sm text-gray-600">
          Total: ₹{totalExpenses.toFixed(2)}
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {Object.entries(balances).map(([member, balance]) => (
          <div key={member} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{member}</span>
            <span className={`font-bold ${
              balance > 0 
                ? 'text-green-600' 
                : balance < 0 
                  ? 'text-red-600' 
                  : 'text-gray-600'
            }`}>
              {balance > 0 && '+'}₹{Math.abs(balance).toFixed(2)}
              {balance > 0 && ' (owed)'}
              {balance < 0 && ' (owes)'}
              {balance === 0 && ' (settled)'}
            </span>
          </div>
        ))}
      </div>

      {settlements.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Settlement Instructions:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {settlements.map((settlement, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>
                  <strong>{settlement.from}</strong> → <strong>{settlement.to}</strong>
                </span>
                <span className="font-bold">₹{settlement.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
