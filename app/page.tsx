'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ExpenseForm from '@/components/ExpenseForm';
import QRScanner from '@/components/QRScanner';
import BalanceView from '@/components/BalanceView';
import MemberManager from '@/components/MemberManager';
import ExpenseHistory from '@/components/ExpenseHistory';
import { Expense, Balance, QRExpenseData, Member } from '@/types';
import { calculateSplit, updateBalances } from '@/lib/utils';

// ✅ Default members (can be customized)
const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'John', isActive: true },
  { id: '2', name: 'Raj', isActive: true },
  { id: '3', name: 'Priya', isActive: true },
  { id: '4', name: 'Amit', isActive: true },
  { id: '5', name: 'Sarah', isActive: true },
];

// ✅ Updated ViewType to include 'history'
type ViewType = 'menu' | 'qr' | 'manual' | 'members' | 'history';

export default function TeaTracker(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [balances, setBalances] = useState<Balance>({});
  const [currentView, setCurrentView] = useState<ViewType>('menu');
  const [qrData, setQrData] = useState<QRExpenseData | null>(null);

  // Initialize balances when members change
  useEffect(() => {
    const initialBalances: Balance = {};
    members.forEach(member => {
      initialBalances[member.name] = balances[member.name] || 0;
    });
    setBalances(initialBalances);
  }, [members]);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('tea-expenses');
    const savedMembers = localStorage.getItem('tea-members');
    const savedBalances = localStorage.getItem('tea-balances');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
    if (savedBalances) {
      setBalances(JSON.parse(savedBalances));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('tea-expenses', JSON.stringify(expenses));
    localStorage.setItem('tea-members', JSON.stringify(members));
    localStorage.setItem('tea-balances', JSON.stringify(balances));
  }, [expenses, members, balances]);

  const activeMemberNames = members.filter(m => m.isActive).map(m => m.name);

  const addExpense = (expenseData: QRExpenseData): void => {
    if (!expenseData.amount || !expenseData.paidBy) {
      toast.error('Please fill all required fields');
      return;
    }

    const perPersonCost = calculateSplit(expenseData.amount, activeMemberNames.length);
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: expenseData.amount,
      description: expenseData.description || 'Tea',
      paidBy: expenseData.paidBy,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      location: expenseData.location,
      billRef: expenseData.billRef || undefined,
      perPersonCost,
      qrSource: expenseData.qrSource,
      autoFilled: expenseData.autoFilled || false
    };

    setExpenses(prev => [newExpense, ...prev]);
    setBalances(prev => updateBalances(prev, newExpense));

    toast.success(`✅ Expense added! ₹${perPersonCost.toFixed(2)} per person`);
    setCurrentView('menu');
    setQrData(null);
  };

  const handleQRScanned = (scannedData: QRExpenseData): void => {
    setQrData(scannedData);
    setCurrentView('manual');
    
    if (scannedData.hasAmount && scannedData.amount) {
      toast.success(`✅ Found ₹${scannedData.amount} at ${scannedData.merchant || 'Tea Shop'}`);
    } else {
      toast(`📍 Found ${scannedData.merchant || 'Tea Shop'} - please enter amount`, {
        icon: 'ℹ️',
        style: {
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          border: '1px solid #bbdefb'
        }
      });
    }
  };

  const resetToMenu = (): void => {
    setCurrentView('menu');
    setQrData(null);
  };

  const handleMembersChange = (newMembers: Member[]): void => {
    setMembers(newMembers);
    
    // Update balances to include new members or remove old ones
    const newBalances: Balance = {};
    newMembers.forEach(member => {
      newBalances[member.name] = balances[member.name] || 0;
    });
    setBalances(newBalances);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto">
        {/* ✅ Updated Header with History Button */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-blue-600">
              🍵 Tea Expense Tracker
            </h1>
            <button
              onClick={() => setCurrentView('members')}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Manage members"
            >
              👥
            </button>
            {/* ✅ New History Button */}
            <button
              onClick={() => setCurrentView('history')}
              className="text-purple-600 hover:text-purple-800 p-1"
              title="View expense history"
            >
              📊
            </button>
          </div>
          <p className="text-gray-600">
            Track and split tea expenses fairly • {activeMemberNames.length} members • {expenses.length} total expenses
          </p>
        </div>

        {/* Balance Overview */}
        <BalanceView balances={balances} />

        {/* ✅ Updated Main Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* ✅ Members Management View */}
          {currentView === 'members' && (
            <MemberManager 
              members={members}
              onMembersChange={handleMembersChange}
              onClose={() => setCurrentView('menu')}
            />
          )}

          {/* ✅ New Expense History View */}
          {currentView === 'history' && (
            <ExpenseHistory 
              expenses={expenses}
              members={members}
              onClose={() => setCurrentView('menu')}
            />
          )}

          {/* Expense Entry Views */}
          {currentView !== 'members' && currentView !== 'history' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add New Expense</h2>
                {currentView !== 'menu' && (
                  <button
                    onClick={resetToMenu}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Back
                  </button>
                )}
              </div>
              
              {/* ✅ Updated Main Menu with History Option */}
              {currentView === 'menu' && (
                <div className="space-y-3">
                  {/* Primary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCurrentView('qr')}
                      className="bg-blue-500 text-white p-4 rounded-lg font-medium hover:bg-blue-600 flex flex-col items-center gap-2"
                    >
                      <span className="text-2xl">📱</span>
                      <span>Scan QR Code</span>
                      <span className="text-xs opacity-75">Auto-capture details</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('manual')}
                      className="bg-green-500 text-white p-4 rounded-lg font-medium hover:bg-green-600 flex flex-col items-center gap-2"
                    >
                      <span className="text-2xl">✏️</span>
                      <span>Manual Entry</span>
                      <span className="text-xs opacity-75">Type details</span>
                    </button>
                  </div>
                  
                  {/* ✅ New History & Analytics Button */}
                  <button
                    onClick={() => setCurrentView('history')}
                    className="w-full bg-purple-500 text-white p-4 rounded-lg font-medium hover:bg-purple-600 flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">📊</span>
                    <span>View History & Analytics</span>
                    <span className="text-sm opacity-75">({expenses.length} expenses)</span>
                  </button>
                </div>
              )}
              
              {currentView === 'qr' && (
                <QRScanner 
                  onQRScanned={handleQRScanned}
                  onCancel={resetToMenu}
                />
              )}

              {currentView === 'manual' && (
                <ExpenseForm 
                  onSubmit={addExpense} 
                  members={activeMemberNames}
                  initialData={qrData || undefined}
                />
              )}
            </>
          )}
        </div>

        {/* ✅ Updated Recent Expenses (Only show when not in members or history view) */}
        {currentView !== 'members' && currentView !== 'history' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              {expenses.length > 5 && (
                <button
                  onClick={() => setCurrentView('history')}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  View All →
                </button>
              )}
            </div>
            
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No expenses yet. Add your first tea expense above! ☝️
              </p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          Paid by {expense.paidBy} • {expense.date} {expense.time}
                        </p>
                        {expense.location && expense.location !== 'Manual Entry' && (
                          <p className="text-xs text-gray-500">📍 {expense.location}</p>
                        )}
                        {expense.autoFilled && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                            📱 QR Auto-filled
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg">₹{expense.amount}</p>
                        <p className="text-sm text-gray-600">₹{expense.perPersonCost.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expenses.length > 5 && (
                  <div className="text-center pt-3 border-t">
                    <button
                      onClick={() => setCurrentView('history')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      📊 View All {expenses.length} Expenses & Analytics →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
