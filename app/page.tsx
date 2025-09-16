// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Toaster, toast } from 'react-hot-toast';
// import ExpenseForm from '@/components/ExpenseForm';
// import QRScanner from '@/components/QRScanner';
// import BalanceView from '@/components/BalanceView';
// import MemberManager from '@/components/MemberManager';
// import ExpenseHistory from '@/components/ExpenseHistory';
// import { Expense, Balance, QRExpenseData, Member } from '@/types';
// import { calculateSplit, updateBalances } from '@/lib/utils';

// // ✅ Default members (can be customized)
// const DEFAULT_MEMBERS: Member[] = [
//   { id: '1', name: 'John', isActive: true },
//   { id: '2', name: 'Raj', isActive: true },
//   { id: '3', name: 'Priya', isActive: true },
//   { id: '4', name: 'Amit', isActive: true },
//   { id: '5', name: 'Sarah', isActive: true },
// ];

// // ✅ Updated ViewType to include 'history'
// type ViewType = 'menu' | 'qr' | 'manual' | 'members' | 'history';

// export default function TeaTracker(): JSX.Element {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [members, setMembers] = useState<Member[]>(DEFAULT_MEMBERS);
//   const [balances, setBalances] = useState<Balance>({});
//   const [currentView, setCurrentView] = useState<ViewType>('menu');
//   const [qrData, setQrData] = useState<QRExpenseData | null>(null);

//   // Initialize balances when members change
//   useEffect(() => {
//     const initialBalances: Balance = {};
//     members.forEach(member => {
//       initialBalances[member.name] = balances[member.name] || 0;
//     });
//     setBalances(initialBalances);
//   }, [members]);

//   // Load data from localStorage
//   useEffect(() => {
//     const savedExpenses = localStorage.getItem('tea-expenses');
//     const savedMembers = localStorage.getItem('tea-members');
//     const savedBalances = localStorage.getItem('tea-balances');
    
//     if (savedExpenses) {
//       setExpenses(JSON.parse(savedExpenses));
//     }
//     if (savedMembers) {
//       setMembers(JSON.parse(savedMembers));
//     }
//     if (savedBalances) {
//       setBalances(JSON.parse(savedBalances));
//     }
//   }, []);

//   // Save data to localStorage
//   useEffect(() => {
//     localStorage.setItem('tea-expenses', JSON.stringify(expenses));
//     localStorage.setItem('tea-members', JSON.stringify(members));
//     localStorage.setItem('tea-balances', JSON.stringify(balances));
//   }, [expenses, members, balances]);

//   const activeMemberNames = members.filter(m => m.isActive).map(m => m.name);

//   const addExpense = (expenseData: QRExpenseData): void => {
//     if (!expenseData.amount || !expenseData.paidBy) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     const perPersonCost = calculateSplit(expenseData.amount, activeMemberNames.length);
    
//     const newExpense: Expense = {
//       id: Date.now().toString(),
//       amount: expenseData.amount,
//       description: expenseData.description || 'Tea',
//       paidBy: expenseData.paidBy,
//       date: new Date().toLocaleDateString(),
//       time: new Date().toLocaleTimeString(),
//       location: expenseData.location,
//       billRef: expenseData.billRef || undefined,
//       perPersonCost,
//       qrSource: expenseData.qrSource,
//       autoFilled: expenseData.autoFilled || false
//     };

//     setExpenses(prev => [newExpense, ...prev]);
//     setBalances(prev => updateBalances(prev, newExpense));

//     toast.success(`✅ Expense added! ₹${perPersonCost.toFixed(2)} per person`);
//     setCurrentView('menu');
//     setQrData(null);
//   };

//   const handleQRScanned = (scannedData: QRExpenseData): void => {
//     setQrData(scannedData);
//     setCurrentView('manual');
    
//     if (scannedData.hasAmount && scannedData.amount) {
//       toast.success(`✅ Found ₹${scannedData.amount} at ${scannedData.merchant || 'Tea Shop'}`);
//     } else {
//       toast(`📍 Found ${scannedData.merchant || 'Tea Shop'} - please enter amount`, {
//         icon: 'ℹ️',
//         style: {
//           backgroundColor: '#e3f2fd',
//           color: '#1976d2',
//           border: '1px solid #bbdefb'
//         }
//       });
//     }
//   };

//   const resetToMenu = (): void => {
//     setCurrentView('menu');
//     setQrData(null);
//   };

//   const handleMembersChange = (newMembers: Member[]): void => {
//     setMembers(newMembers);
    
//     // Update balances to include new members or remove old ones
//     const newBalances: Balance = {};
//     newMembers.forEach(member => {
//       newBalances[member.name] = balances[member.name] || 0;
//     });
//     setBalances(newBalances);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <Toaster position="top-center" />
      
//       <div className="max-w-md mx-auto">
//         {/* ✅ Updated Header with History Button */}
//         <div className="text-center mb-6">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <h1 className="text-3xl font-bold text-black">
//               🍵 Tea Expense Tracker
//             </h1>
//             <button
//               onClick={() => setCurrentView('members')}
//               className="text-blue-600 hover:text-blue-800 p-1"
//               title="Manage members"
//             >
//               👥
//             </button>
//             {/* ✅ New History Button */}
//             <button
//               onClick={() => setCurrentView('history')}
//               className="text-purple-600 hover:text-purple-800 p-1"
//               title="View expense history"
//             >
//               📊
//             </button>
//           </div>
//           <p className="text-gray-600">
//             Track and split tea expenses fairly • {activeMemberNames.length} members • {expenses.length} total expenses
//           </p>
//         </div>

//         {/* Balance Overview */}
//         <BalanceView balances={balances} />

//         {/* ✅ Updated Main Content Section */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           {/* ✅ Members Management View */}
//           {currentView === 'members' && (
//             <MemberManager 
//               members={members}
//               onMembersChange={handleMembersChange}
//               onClose={() => setCurrentView('menu')}
//             />
//           )}

//           {/* ✅ New Expense History View */}
//           {currentView === 'history' && (
//             <ExpenseHistory 
//               expenses={expenses}
//               members={members}
//               onClose={() => setCurrentView('menu')}
//             />
//           )}

//           {/* Expense Entry Views */}
//           {currentView !== 'members' && currentView !== 'history' && (
//             <>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-semibold">Add New Expense</h2>
//                 {currentView !== 'menu' && (
//                   <button
//                     onClick={resetToMenu}
//                     className="text-sm text-gray-500 hover:text-gray-700"
//                   >
//                     ← Back
//                   </button>
//                 )}
//               </div>
              
//               {/* ✅ Updated Main Menu with History Option */}
//               {currentView === 'menu' && (
//                 <div className="space-y-3">
//                   {/* Primary Actions */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <button
//                       onClick={() => setCurrentView('qr')}
//                       className="bg-blue-500 text-white p-4 rounded-lg font-medium hover:bg-blue-600 flex flex-col items-center gap-2"
//                     >
//                       <span className="text-2xl">📱</span>
//                       <span>Scan QR Code</span>
//                       <span className="text-xs opacity-75">Auto-capture details</span>
//                     </button>
//                     <button
//                       onClick={() => setCurrentView('manual')}
//                       className="bg-green-500 text-white p-4 rounded-lg font-medium hover:bg-green-600 flex flex-col items-center gap-2"
//                     >
//                       <span className="text-2xl">✏️</span>
//                       <span>Manual Entry</span>
//                       <span className="text-xs opacity-75">Type details</span>
//                     </button>
//                   </div>
                  
//                   {/* ✅ New History & Analytics Button */}
//                   <button
//                     onClick={() => setCurrentView('history')}
//                     className="w-full bg-purple-500 text-white p-4 rounded-lg font-medium hover:bg-purple-600 flex items-center justify-center gap-2"
//                   >
//                     <span className="text-xl">📊</span>
//                     <span>View History & Analytics</span>
//                     <span className="text-sm opacity-75">({expenses.length} expenses)</span>
//                   </button>
//                 </div>
//               )}
              
//               {currentView === 'qr' && (
//                 <QRScanner 
//                   onQRScanned={handleQRScanned}
//                   onCancel={resetToMenu}
//                 />
//               )}

//               {currentView === 'manual' && (
//                 <ExpenseForm 
//                   onSubmit={addExpense} 
//                   members={activeMemberNames}
//                   initialData={qrData || undefined}
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* ✅ Updated Recent Expenses (Only show when not in members or history view) */}
//         {currentView !== 'members' && currentView !== 'history' && (
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Recent Expenses</h2>
//               {expenses.length > 5 && (
//                 <button
//                   onClick={() => setCurrentView('history')}
//                   className="text-purple-600 hover:text-purple-800 text-sm"
//                 >
//                   View All →
//                 </button>
//               )}
//             </div>
            
//             {expenses.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">
//                 No expenses yet. Add your first tea expense above! ☝️
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {expenses.slice(0, 5).map((expense) => (
//                   <div key={expense.id} className="border-l-4 border-blue-500 pl-4 py-2">
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p className="font-medium">{expense.description}</p>
//                         <p className="text-sm text-gray-600">
//                           Paid by {expense.paidBy} • {expense.date} {expense.time}
//                         </p>
//                         {expense.location && expense.location !== 'Manual Entry' && (
//                           <p className="text-xs text-gray-500">📍 {expense.location}</p>
//                         )}
//                         {expense.autoFilled && (
//                           <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
//                             📱 QR Auto-filled
//                           </span>
//                         )}
//                       </div>
//                       <div className="text-right ml-4">
//                         <p className="font-bold text-lg">₹{expense.amount}</p>
//                         <p className="text-sm text-gray-600">₹{expense.perPersonCost.toFixed(2)} each</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {expenses.length > 5 && (
//                   <div className="text-center pt-3 border-t">
//                     <button
//                       onClick={() => setCurrentView('history')}
//                       className="text-purple-600 hover:text-purple-800 text-sm font-medium"
//                     >
//                       📊 View All {expenses.length} Expenses & Analytics →
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
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
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
          border: '1px solid #7dd3fc'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-md mx-auto">
        {/* ✅ Enhanced Header with Modern Styling */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl shadow-lg">
              <span className="text-2xl">🍵</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Tea Expense Tracker
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('members')}
                className="bg-white/70 backdrop-blur-sm text-slate-600 hover:text-indigo-600 hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                title="Manage members"
              >
                👥
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className="bg-white/70 backdrop-blur-sm text-slate-600 hover:text-violet-600 hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                title="View expense history"
              >
                📊
              </button>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            Track and split tea expenses fairly • {activeMemberNames.length} members • {expenses.length} total expenses
          </p>
        </div>

        {/* Enhanced Balance Overview */}
        <BalanceView balances={balances} />

        {/* ✅ Enhanced Main Content Section with Modern Card Design */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          {/* ✅ Members Management View */}
          {currentView === 'members' && (
            <MemberManager 
              members={members}
              onMembersChange={handleMembersChange}
              onClose={() => setCurrentView('menu')}
            />
          )}

          {/* ✅ Expense History View */}
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
              
              {/* ✅ Enhanced Main Menu with Modern Button Design */}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 rounded-xl transition-all duration-200"></div>
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
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/20 group-hover:to-teal-400/20 rounded-xl transition-all duration-200"></div>
                    </button>
                  </div>
                  
                  {/* ✅ Enhanced History & Analytics Button */}
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
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 to-purple-400/0 group-hover:from-violet-400/20 group-hover:to-purple-400/20 rounded-xl transition-all duration-200"></div>
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

        {/* ✅ Enhanced Recent Expenses with Modern Card Design */}
        {currentView !== 'members' && currentView !== 'history' && (
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
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🍵</span>
                </div>
                <p className="text-slate-500">
                  No expenses yet. Add your first tea expense above! ☝️
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