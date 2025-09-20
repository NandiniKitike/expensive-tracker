// 'use client';

// import React, { useState, useMemo } from 'react';
// import { Expense, Member } from '@/types';

// interface ExpenseHistoryProps {
//   expenses: Expense[];
//   members: Member[];
//   onClose: () => void;
// }

// export default function ExpenseHistory({ expenses, members, onClose }: ExpenseHistoryProps): JSX.Element {
//   const [selectedYear, setSelectedYear] = useState<string>('All');
//   const [selectedMonth, setSelectedMonth] = useState<string>('All');
//   const [selectedMember, setSelectedMember] = useState<string>('All');
//   const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [showFilters, setShowFilters] = useState<boolean>(false);

//   // Extract year and month from date string
//   const getYear = (dateStr: string): string => {
//     const date = new Date(dateStr.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
//     return date.getFullYear().toString();
//   };

//   const getMonth = (dateStr: string): string => {
//     const date = new Date(dateStr.split('/').reverse().join('-'));
//     return (date.getMonth() + 1).toString().padStart(2, '0');
//   };

//   const getMonthName = (monthNum: string): string => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months[parseInt(monthNum) - 1] || monthNum;
//   };

//   // Filter expenses based on all criteria
//   const filteredExpenses = useMemo(() => {
//     return expenses.filter(expense => {
//       // Year filter
//       if (selectedYear !== 'All' && getYear(expense.date) !== selectedYear) return false;
      
//       // Month filter  
//       if (selectedMonth !== 'All' && getMonth(expense.date) !== selectedMonth) return false;
      
//       // Member filter
//       if (selectedMember !== 'All' && expense.paidBy !== selectedMember) return false;
      
//       // Date range filter
//       if (dateRange.from) {
//         const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
//         const fromDate = new Date(dateRange.from);
//         if (expenseDate < fromDate) return false;
//       }
      
//       if (dateRange.to) {
//         const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
//         const toDate = new Date(dateRange.to);
//         if (expenseDate > toDate) return false;
//       }
      
//       // Search term filter
//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         const matchesDescription = expense.description.toLowerCase().includes(searchLower);
//         const matchesLocation = expense.location?.toLowerCase().includes(searchLower);
//         const matchesPayer = expense.paidBy.toLowerCase().includes(searchLower);
//         if (!matchesDescription && !matchesLocation && !matchesPayer) return false;
//       }
      
//       return true;
//     });
//   }, [expenses, selectedYear, selectedMonth, selectedMember, dateRange, searchTerm]);

//   // Get unique years and months for dropdowns
//   const availableYears = useMemo(() => {
//     const years = Array.from(new Set(expenses.map(exp => getYear(exp.date))));
//     return years.sort((a, b) => parseInt(b) - parseInt(a)); // Most recent first
//   }, [expenses]);

//   const availableMonths = useMemo(() => {
//     const months = Array.from(new Set(expenses.map(exp => getMonth(exp.date))));
//     return months.sort((a, b) => parseInt(a) - parseInt(b));
//   }, [expenses]);

//   // Calculate statistics for filtered data
//   const statistics = useMemo(() => {
//     const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
//     const memberSpending = filteredExpenses.reduce((acc, exp) => {
//       acc[exp.paidBy] = (acc[exp.paidBy] || 0) + exp.amount;
//       return acc;
//     }, {} as Record<string, number>);
    
//     return {
//       totalExpenses: filteredExpenses.length,
//       totalAmount,
//       avgExpense: filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0,
//       memberSpending
//     };
//   }, [filteredExpenses]);

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedYear('All');
//     setSelectedMonth('All');
//     setSelectedMember('All');
//     setDateRange({ from: '', to: '' });
//     setSearchTerm('');
//   };

//   // Check if any filters are active
//   const hasActiveFilters = selectedYear !== 'All' || selectedMonth !== 'All' || selectedMember !== 'All' || dateRange.from || dateRange.to || searchTerm;

//   return (
//     <div className="space-y-6">
//       {/* Enhanced Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-xl shadow-lg">
//             <span className="text-xl">📊</span>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//               Expense History
//             </h2>
//             <p className="text-sm text-slate-600">Detailed analytics and expense tracking</p>
//           </div>
//         </div>
//         <button 
//           onClick={onClose} 
//           className="bg-white/70 backdrop-blur-sm text-slate-600 hover:text-red-600 hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Compact Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-3 rounded-lg shadow-md">
//           <div className="flex items-center gap-2">
          
//             <div className="min-w-0">
//               <p className="text-blue-100 text-xs font-medium">Total Expenses</p>
//               <p className="text-xl font-bold">{statistics.totalExpenses}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-3 rounded-lg shadow-md">
//           <div className="flex items-center gap-2"> 
//             <div className="min-w-0">
//               <p className="text-emerald-100 text-xs font-medium">Total Amount</p>
//               <p className="text-xl font-bold">₹{statistics.totalAmount.toFixed(0)}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-3 rounded-lg shadow-md">
//           <div className="flex items-center gap-2">
           
//             <div className="min-w-0">
//               <p className="text-amber-100 text-xs font-medium">Average</p>
//               <p className="text-xl font-bold">₹{statistics.avgExpense.toFixed(0)}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-violet-500 to-purple-500 text-white p-3 rounded-lg shadow-md">
//           <div className="flex items-center gap-2">
           
//             <div className="min-w-0 flex-1">
//               <p className="text-violet-100 text-xs font-medium">Top Spender</p>
//               <p className="text-lg font-bold truncate">
//                 {Object.keys(statistics.memberSpending).length > 0 
//                   ? Object.entries(statistics.memberSpending)
//                       .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
//                   : 'None'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar and Filter Toggle */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="🔍 Search description, location, or payer..."
//                 className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                 showFilters || hasActiveFilters
//                   ? 'bg-violet-500 text-white shadow-lg'
//                   : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//               }`}
//             >
//               <span>🎛️</span>
//               <span>Filters</span>
//               {hasActiveFilters && (
//                 <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Expandable Filters */}
//         {showFilters && (
//           <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold text-slate-800 flex items-center gap-2">
//                 <span>🎯</span> Advanced Filters
//               </h3>
//               {hasActiveFilters && (
//                 <button
//                   onClick={clearFilters}
//                   className="text-violet-600 hover:text-violet-700 text-sm font-medium bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-all duration-200"
//                 >
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {/* Filter Controls */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 >
//                   <option value="All">All Years</option>
//                   {availableYears.map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
//                 <select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(e.target.value)}
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 >
//                   <option value="All">All Months</option>
//                   {availableMonths.map(month => (
//                     <option key={month} value={month}>{getMonthName(month)}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">Paid By</label>
//                 <select
//                   value={selectedMember}
//                   onChange={(e) => setSelectedMember(e.target.value)}
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 >
//                   <option value="All">All Members</option>
//                   {members.map(member => (
//                     <option key={member.id} value={member.name}>{member.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Date Range */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
//                 <input
//                   type="date"
//                   value={dateRange.from}
//                   onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
//                 <input
//                   type="date"
//                   value={dateRange.to}
//                   onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             <div className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
//               Showing <span className="font-semibold text-violet-600">{filteredExpenses.length}</span> of <span className="font-semibold">{expenses.length}</span> expenses
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Member Spending Breakdown */}
//       {Object.keys(statistics.memberSpending).length > 0 && (
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
//           <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//             <span>👥</span> Member Spending Breakdown
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.entries(statistics.memberSpending)
//               .sort(([,a], [,b]) => b - a)
//               .map(([member, amount], index) => {
//                 const percentage = statistics.totalAmount > 0 ? (amount / statistics.totalAmount) * 100 : 0;
//                 const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];
//                 const colorClass = colors[index % colors.length];
                
//                 return (
//                   <div key={member} className="bg-slate-50 rounded-xl p-4">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="font-medium text-slate-800">{member}</span>
//                       <span className="font-bold text-lg">₹{amount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 bg-slate-200 rounded-full h-2">
//                         <div 
//                           className={`${colorClass} h-2 rounded-full transition-all duration-500`}
//                           style={{ width: `${percentage}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-sm text-slate-600">{percentage.toFixed(1)}%</span>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       )}

//       {/* Expense List */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
//         <div className="p-6 border-b border-slate-200">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
//               <span>📋</span> Expense Details
//             </h3>
//             <button
//               onClick={() => {
//                 const csvContent = [
//                   ['Date', 'Time', 'Description', 'Amount', 'Paid By', 'Per Person', 'Location'].join(','),
//                   ...filteredExpenses.map(exp => [
//                     exp.date,
//                     exp.time,
//                     exp.description,
//                     exp.amount,
//                     exp.paidBy,
//                     exp.perPersonCost,
//                     exp.location || ''
//                   ].join(','))
//                 ].join('\n');
                
//                 const blob = new Blob([csvContent], { type: 'text/csv' });
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = `tea-expenses-filtered-${new Date().toISOString().split('T')[0]}.csv`;
//                 a.click();
//               }}
//               className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
//             >
//               <span>📥</span>
//               <span>Export ({filteredExpenses.length})</span>
//             </button>
//           </div>
//         </div>

//         <div className="max-h-96 overflow-y-auto">
//           {filteredExpenses.length === 0 ? (
//             <div className="p-12 text-center">
//               <div className="bg-gradient-to-r from-slate-400 to-slate-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                 <span className="text-2xl">🔍</span>
//               </div>
//               <p className="text-slate-600 font-medium mb-2">No expenses found</p>
//               <p className="text-sm text-slate-500">Try adjusting your search criteria or filters</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {filteredExpenses.map((expense, index) => {
//                 const borderColors = ['border-l-blue-500', 'border-l-emerald-500', 'border-l-amber-500', 'border-l-violet-500', 'border-l-rose-500'];
//                 const borderClass = borderColors[index % borderColors.length];
                
//                 return (
//                   <div 
//                     key={expense.id} 
//                     className={`group p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 border-l-4 ${borderClass}`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <span className="font-semibold text-slate-800 group-hover:text-slate-900">
//                             {expense.description}
//                           </span>
//                           {expense.autoFilled && (
//                             <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
//                               <span>📱</span> QR Auto-filled
//                             </span>
//                           )}
//                         </div>
//                         <div className="text-sm text-slate-600 mb-1">
//                           <span className="font-medium">{expense.date}</span> at <span className="font-medium">{expense.time}</span> • Paid by <span className="font-medium text-slate-700">{expense.paidBy}</span>
//                         </div>
//                         {expense.location && expense.location !== 'Manual Entry' && (
//                           <div className="text-xs text-slate-500 flex items-center gap-1">
//                             <span>📍</span> {expense.location}
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right ml-4">
//                         <div className="font-bold text-xl text-slate-800">₹{expense.amount}</div>
//                         <div className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
//                           ₹{expense.perPersonCost.toFixed(2)} each
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useMemo } from 'react';

// Mock types for demonstration
interface Expense {
  id: string;
  date: string;
  time: string;
  description: string;
  amount: number;
  paidBy: string;
  perPersonCost: number;
  location?: string;
  autoFilled?: boolean;
}

interface Member {
  id: string;
  name: string;
}

interface ExpenseHistoryProps {
  expenses: Expense[];
  members: Member[];
  onClose: () => void;
}

// Sample data for demonstration
const sampleExpenses: Expense[] = [
  { id: '1', date: '15/09/2025', time: '10:30', description: 'Morning Tea', amount: 150, paidBy: 'John', perPersonCost: 30, location: 'Office Canteen' },
  { id: '2', date: '14/09/2025', time: '15:45', description: 'Afternoon Snacks', amount: 280, paidBy: 'Sarah', perPersonCost: 56, location: 'Nearby Café' },
  { id: '3', date: '13/09/2025', time: '11:15', description: 'Team Lunch', amount: 1200, paidBy: 'Mike', perPersonCost: 240, autoFilled: true },
  { id: '4', date: '10/08/2025', time: '09:00', description: 'Breakfast Meeting', amount: 450, paidBy: 'John', perPersonCost: 90, location: 'Hotel Restaurant' },
  { id: '5', date: '25/08/2025', time: '16:30', description: 'Coffee Break', amount: 120, paidBy: 'Sarah', perPersonCost: 24, location: 'Coffee Shop' },
  { id: '6', date: '20/07/2025', time: '12:00', description: 'Office Party', amount: 2500, paidBy: 'Mike', perPersonCost: 500, autoFilled: true },
];

const sampleMembers: Member[] = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Sarah' },
  { id: '3', name: 'Mike' },
];

export default function ExpenseHistory({ 
  expenses = sampleExpenses, 
  members = sampleMembers, 
  onClose = () => {} 
}: Partial<ExpenseHistoryProps>): JSX.Element {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Extract year and month from date string
  const getYear = (dateStr: string): string => {
    const date = new Date(dateStr.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    return date.getFullYear().toString();
  };

  const getMonth = (dateStr: string): string => {
    const date = new Date(dateStr.split('/').reverse().join('-'));
    return (date.getMonth() + 1).toString().padStart(2, '0');
  };

  const getMonthName = (monthNum: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  // Filter expenses based on all criteria
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Year filter
      if (selectedYear !== 'All' && getYear(expense.date) !== selectedYear) return false;
      
      // Month filter  
      if (selectedMonth !== 'All' && getMonth(expense.date) !== selectedMonth) return false;
      
      // Member filter
      if (selectedMember !== 'All' && expense.paidBy !== selectedMember) return false;
      
      // Date range filter
      if (dateRange.from) {
        const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
        const fromDate = new Date(dateRange.from);
        if (expenseDate < fromDate) return false;
      }
      
      if (dateRange.to) {
        const expenseDate = new Date(expense.date.split('/').reverse().join('-'));
        const toDate = new Date(dateRange.to);
        if (expenseDate > toDate) return false;
      }
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesDescription = expense.description.toLowerCase().includes(searchLower);
        const matchesLocation = expense.location?.toLowerCase().includes(searchLower);
        const matchesPayer = expense.paidBy.toLowerCase().includes(searchLower);
        if (!matchesDescription && !matchesLocation && !matchesPayer) return false;
      }
      
      return true;
    });
  }, [expenses, selectedYear, selectedMonth, selectedMember, dateRange, searchTerm]);

  // Get unique years and months for dropdowns
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(expenses.map(exp => getYear(exp.date))));
    return years.sort((a, b) => parseInt(b) - parseInt(a)); // Most recent first
  }, [expenses]);

  const availableMonths = useMemo(() => {
    const months = Array.from(new Set(expenses.map(exp => getMonth(exp.date))));
    return months.sort((a, b) => parseInt(a) - parseInt(b));
  }, [expenses]);

  // Calculate statistics for filtered data
  const statistics = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const memberSpending = filteredExpenses.reduce((acc, exp) => {
      acc[exp.paidBy] = (acc[exp.paidBy] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Month-wise breakdown
    const monthlySpending = filteredExpenses.reduce((acc, exp) => {
      const year = getYear(exp.date);
      const month = getMonth(exp.date);
      const monthKey = `${year}-${month}`;
      const monthLabel = `${getMonthName(month)} ${year}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { label: monthLabel, total: 0, count: 0, expenses: [] };
      }
      acc[monthKey].total += exp.amount;
      acc[monthKey].count += 1;
      acc[monthKey].expenses.push(exp);
      return acc;
    }, {} as Record<string, { label: string; total: number; count: number; expenses: typeof filteredExpenses }>);
    
    return {
      totalExpenses: filteredExpenses.length,
      totalAmount,
      avgExpense: filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0,
      memberSpending,
      monthlySpending
    };
  }, [filteredExpenses]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedYear('All');
    setSelectedMonth('All');
    setSelectedMember('All');
    setDateRange({ from: '', to: '' });
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = selectedYear !== 'All' || selectedMonth !== 'All' || selectedMember !== 'All' || dateRange.from || dateRange.to || searchTerm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
           
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Expense History
              </h2>
              <p className="text-sm text-slate-600">Detailed analytics and expense tracking</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/70 backdrop-blur-sm text-slate-600 hover:text-red-600 hover:bg-white/90 p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Compact Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="min-w-0">
                <p className="text-blue-100 text-xs font-medium">Total Expenses</p>
                <p className="text-xl font-bold">{statistics.totalExpenses}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2"> 
              <div className="min-w-0">
                <p className="text-emerald-100 text-xs font-medium">Total Amount</p>
                <p className="text-xl font-bold">₹{statistics.totalAmount.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="min-w-0">
                <p className="text-amber-100 text-xs font-medium">Average</p>
                <p className="text-xl font-bold">₹{statistics.avgExpense.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-500 text-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-violet-100 text-xs font-medium">Top Spender</p>
                <p className="text-lg font-bold truncate">
                  {Object.keys(statistics.memberSpending).length > 0 
                    ? Object.entries(statistics.memberSpending)
                        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                    : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar and Filter Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder=" Search description, location, or payer..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  showFilters || hasActiveFilters
                    ? 'bg-violet-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
               
                <span>Apply Filters</span>
                {hasActiveFilters && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  Advanced Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-violet-600 hover:text-violet-700 text-sm font-medium bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="All">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="All">All Months</option>
                    {availableMonths.map(month => (
                      <option key={month} value={month}>{getMonthName(month)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Paid By</label>
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="All">All Members</option>
                    {members.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                Showing <span className="font-semibold text-violet-600">{filteredExpenses.length}</span> of <span className="font-semibold">{expenses.length}</span> expenses
              </div>
            </div>
          )}
        </div>

        {/* Member Spending Breakdown */}
        {Object.keys(statistics.memberSpending).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              Member Spending Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(statistics.memberSpending)
                .sort(([,a], [,b]) => b - a)
                .map(([member, amount], index) => {
                  const percentage = statistics.totalAmount > 0 ? (amount / statistics.totalAmount) * 100 : 0;
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={member} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-800">{member}</span>
                        <span className="font-bold text-lg">₹{amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-600">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Month-wise Spending Breakdown */}
        {Object.keys(statistics.monthlySpending).length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              Month-wise Spending Summary
            </h3>
            <div className="space-y-4">
              {Object.entries(statistics.monthlySpending)
                .sort(([a], [b]) => b.localeCompare(a)) // Most recent first
                .map(([monthKey, data]) => {
                  const percentage = statistics.totalAmount > 0 ? (data.total / statistics.totalAmount) * 100 : 0;
                  const avgPerExpense = data.count > 0 ? data.total / data.count : 0;
                  
                  return (
                    <div key={monthKey} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-lg">{data.label}</h4>
                          <p className="text-sm text-slate-600">{data.count} expense{data.count !== 1 ? 's' : ''} • ₹{avgPerExpense.toFixed(2)} average</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-slate-800">₹{data.total.toFixed(2)}</div>
                          <div className="text-sm text-slate-600">{percentage.toFixed(1)}% of total</div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500 min-w-[3rem]">{percentage.toFixed(1)}%</span>
                      </div>

                      {/* Top 3 expenses for this month */}
                      {/* <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Top Expenses</p>
                        {data.expenses
                          .sort((a, b) => b.amount - a.amount)
                          .slice(0, 3)
                          .map((expense, idx) => (
                            <div key={expense.id} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-medium">
                                  #{idx + 1}
                                </span>
                                <span className="font-medium text-slate-700 truncate max-w-[200px]">{expense.description}</span>
                                <span className="text-slate-500">by {expense.paidBy}</span>
                              </div>
                              <span className="font-bold text-slate-800">₹{expense.amount}</span>
                            </div>
                          ))}
                      </div> */}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Expense List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                Expense Details
              </h3>
              <button
                onClick={() => {
                  const csvContent = [
                    ['Date', 'Time', 'Description', 'Amount', 'Paid By', 'Per Person', 'Location'].join(','),
                    ...filteredExpenses.map(exp => [
                      exp.date,
                      exp.time,
                      exp.description,
                      exp.amount,
                      exp.paidBy,
                      exp.perPersonCost,
                      exp.location || ''
                    ].join(','))
                  ].join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `tea-expenses-filtered-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
              
                <span>Export ({filteredExpenses.length})</span>
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gradient-to-r  rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  
                </div>
                <p className="text-slate-600 font-medium mb-2">No expenses found</p>
                <p className="text-sm text-slate-500">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredExpenses.map((expense, index) => {
                  const borderColors = ['border-l-blue-500', 'border-l-emerald-500', 'border-l-amber-500', 'border-l-violet-500', 'border-l-rose-500'];
                  const borderClass = borderColors[index % borderColors.length];
                  
                  return (
                    <div 
                      key={expense.id} 
                      className={`group p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 border-l-4 ${borderClass}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-slate-800 group-hover:text-slate-900">
                              {expense.description}
                            </span>
                            {expense.autoFilled && (
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                <span>📱</span> QR Auto-filled
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mb-1">
                            <span className="font-medium">{expense.date}</span> at <span className="font-medium">{expense.time}</span> • Paid by <span className="font-medium text-slate-700">{expense.paidBy}</span>
                          </div>
                          {expense.location && expense.location !== 'Manual Entry' && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <span>📍</span> {expense.location}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-xl text-slate-800">₹{expense.amount}</div>
                          <div className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                            ₹{expense.perPersonCost.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}