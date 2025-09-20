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

// ✅ Start with empty members array - no static defaults
const DEFAULT_MEMBERS: Member[] = [];

// ✅ Updated ViewType to include 'history'
type ViewType = 'menu' | 'qr' | 'manual' | 'members' | 'history';

export default function TeaTracker(): JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
  const [balances, setBalances] = useState<Balance>({});
  const [currentView, setCurrentView] = useState<ViewType>('members'); // ✅ Start with members view if empty
  const [qrData, setQrData] = useState<QRExpenseData | null>(null);

  // Initialize balances when members change
  useEffect(() => {
    const initialBalances: Balance = {};
    members.forEach(member => {
      initialBalances[member.name] = balances[member.name] || 0;
    });
    setBalances(initialBalances);
  }, [members]);

  // ✅ Auto-redirect to members view if no members exist
  useEffect(() => {
    if (members.length === 0 && currentView === 'menu') {
      setCurrentView('members');
    }
  }, [members.length, currentView]);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('tea-expenses');
    const savedMembers = localStorage.getItem('tea-members');
    const savedBalances = localStorage.getItem('tea-balances');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedMembers) {
      const parsedMembers = JSON.parse(savedMembers);
      setMembers(parsedMembers);
      // ✅ If members exist, go to menu, otherwise stay in members view
      if (parsedMembers.length > 0) {
        setCurrentView('menu');
      }
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
    // ✅ Check if there are active members before adding expense
    if (activeMemberNames.length === 0) {
      toast.error('Please add team members first');
      setCurrentView('members');
      return;
    }

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
    // ✅ Check if there are active members before scanning
    if (activeMemberNames.length === 0) {
      toast.error('Please add team members first');
      setCurrentView('members');
      return;
    }

    setQrData(scannedData);
    setCurrentView('manual');
    
    if (scannedData.hasAmount && scannedData.amount) {
      toast.success(`✅ Found ₹${scannedData.amount} at ${scannedData.merchant || 'Tea Shop'}`);
    } else {
      toast(`📍 Found ${scannedData.merchant || 'Tea Shop'} - please enter amount`, {
        icon: 'ℹ️',
        style: {
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
          border: '1px solid #7dd3fc'
        }
      });
    }
  };

  const resetToMenu = (): void => {
    // ✅ Only go to menu if members exist
    if (members.length === 0) {
      setCurrentView('members');
      toast('Please add team members first', { icon: '👥' });
    } else {
      setCurrentView('menu');
    }
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

    // ✅ Auto-redirect to menu when first members are added
    if (newMembers.length > 0 && members.length === 0) {
      toast.success('✅ Team members added! You can now start tracking expenses');
      setTimeout(() => setCurrentView('menu'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto">
        {/* ✅ Enhanced Header with conditional display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl shadow-lg">
              <span className="text-2xl">🍵</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
               Expense Tracker
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('members')}
                className={`bg-white/70 backdrop-blur-sm ${
                  members.length === 0 ? 'text-orange-600 animate-pulse' : 'text-slate-600 hover:text-indigo-600'
                } hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200`}
                title="Manage members"
              >
                👥
              </button>
              {/* ✅ Only show history button if members exist */}
              {members.length > 0 && (
                <button
                  onClick={() => setCurrentView('history')}
                  className="bg-white/70 backdrop-blur-sm text-slate-600 hover:text-violet-600 hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  title="View expense history"
                >
                  📊
                </button>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            {members.length === 0 ? (
              <span className="text-orange-600 font-medium">👆 Add team members to start tracking expenses</span>
            ) : (
              <>Track and split tea expenses fairly • {activeMemberNames.length} members • {expenses.length} total expenses</>
            )}
          </p>
        </div>

        {/* ✅ Conditional Balance Overview - only show if members exist */}
        {members.length > 0 && <BalanceView balances={balances} />}

        {/* ✅ Enhanced Main Content Section with empty state handling */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          {/* ✅ Members Management View */}
          {currentView === 'members' && (
            <MemberManager 
              members={members}
              onMembersChange={handleMembersChange}
              onClose={() => members.length > 0 ? setCurrentView('menu') : null}
            />
          )}

          {/* ✅ Expense History View - only accessible if members exist */}
          {currentView === 'history' && members.length > 0 && (
            <ExpenseHistory 
              expenses={expenses}
              members={members}
              onClose={() => setCurrentView('menu')}
            />
          )}

          {/* ✅ Expense Entry Views - only show if members exist */}
          {currentView !== 'members' && currentView !== 'history' && members.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Add New Expense</h2>
                {currentView !== 'menu' && (
                  <button
                    onClick={resetToMenu}
                    className="text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    ← Back
                  </button>
                )}
              </div>
              
              {/* ✅ Main Menu */}
              {currentView === 'menu' && (
                <div className="space-y-4">
                  {/* Primary Actions with Gradient Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCurrentView('qr')}
                      className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center gap-3"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/30 transition-all duration-200">
                        <span className="text-2xl">📱</span>
                      </div>
                      <span className="font-semibold">Scan QR Code</span>
                      <span className="text-xs opacity-80">Auto-capture details</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('manual')}
                      className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center gap-3"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/30 transition-all duration-200">
                        <span className="text-2xl">✏️</span>
                      </div>
                      <span className="font-semibold">Manual Entry</span>
                      <span className="text-xs opacity-80">Type details</span>
                    </button>
                  </div>
                  
                  {/* ✅ History & Analytics Button - only show if expenses exist */}
                  {expenses.length > 0 && (
                    <button
                      onClick={() => setCurrentView('history')}
                      className="group relative w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white p-5 rounded-xl font-medium hover:from-violet-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5 group-hover:bg-white/30 transition-all duration-200">
                        <span className="text-xl">📊</span>
                      </div>
                      <span className="font-semibold">View History & Analytics</span>
                      <span className="text-sm opacity-80 bg-white/20 px-2 py-1 rounded-full">
                        {expenses.length} expenses
                      </span>
                    </button>
                  )}
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

          {/* ✅ Empty State Message when no members */}
          {currentView !== 'members' && members.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Add Team Members First</h3>
              <p className="text-slate-600 mb-6">
                You need to add team members before you can start tracking and splitting expenses.
              </p>
              <button
                onClick={() => setCurrentView('members')}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                👥 Add Team Members
              </button>
            </div>
          )}
        </div>

        {/* ✅ Recent Expenses - only show if members and expenses exist */}
        {currentView !== 'members' && currentView !== 'history' && members.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-slate-800">Recent Expenses</h2>
              {expenses.length > 5 && (
                <button
                  onClick={() => setCurrentView('history')}
                  className="text-violet-600 hover:text-violet-700 text-sm font-medium bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  View All →
                </button>
              )}
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                {/* <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🍵</span>
                </div> */}
                <p className="text-slate-500">
                  No expenses yet. Add your first tea expense above! 
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense, index) => (
                  <div 
                    key={expense.id} 
                    className="group bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border-l-4 border-gradient-to-b from-blue-500 to-indigo-500 rounded-r-xl pl-5 pr-4 py-4 hover:shadow-md transition-all duration-200"
                    style={{
                      borderLeftColor: index % 3 === 0 ? '#3b82f6' : index % 3 === 1 ? '#10b981' : '#8b5cf6'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 group-hover:text-slate-900">
                          {expense.description}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Paid by <span className="font-medium text-slate-700">{expense.paidBy}</span> • {expense.date} {expense.time}
                        </p>
                        {expense.location && expense.location !== 'Manual Entry' && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <span>📍</span> {expense.location}
                          </p>
                        )}
                        {expense.autoFilled && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-2 font-medium">
                            <span>📱</span> QR Auto-filled
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg text-slate-800">₹{expense.amount}</p>
                        <p className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          ₹{expense.perPersonCost.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expenses.length > 5 && (
                  <div className="text-center pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setCurrentView('history')}
                      className="group text-violet-600 hover:text-violet-700 text-sm font-medium bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      <span>📊</span>
                      <span>View All {expenses.length} Expenses & Analytics</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
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
