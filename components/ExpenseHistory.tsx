'use client';

import React, { useState, useMemo } from 'react';
import { Expense, Member } from '@/types';

interface ExpenseHistoryProps {
  expenses: Expense[];
  members: Member[];
  onClose: () => void;
}

export default function ExpenseHistory({ expenses, members, onClose }: ExpenseHistoryProps): JSX.Element {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    
    return {
      totalExpenses: filteredExpenses.length,
      totalAmount,
      avgExpense: filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0,
      memberSpending
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">📊 Expense History</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium">🔍 Filter Options</h3>
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search description, location, or payer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{getMonthName(month)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Members</option>
              {members.map(member => (
                <option key={member.id} value={member.name}>{member.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </span>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">📈 Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Expenses</div>
            <div className="font-bold text-lg">{statistics.totalExpenses}</div>
          </div>
          <div>
            <div className="text-gray-600">Total Amount</div>
            <div className="font-bold text-lg">₹{statistics.totalAmount.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Average</div>
            <div className="font-bold text-lg">₹{statistics.avgExpense.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Top Spender</div>
            <div className="font-bold text-lg">
              {Object.keys(statistics.memberSpending).length > 0 
                ? Object.entries(statistics.memberSpending)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
                : 'None'}
            </div>
          </div>
        </div>

        {/* Member spending breakdown */}
        {Object.keys(statistics.memberSpending).length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Member Spending:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(statistics.memberSpending)
                .sort(([,a], [,b]) => b - a)
                .map(([member, amount]) => (
                  <div key={member} className="flex justify-between">
                    <span>{member}</span>
                    <span className="font-medium">₹{amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Expense List */}
      <div className="bg-white border rounded-lg max-h-96 overflow-y-auto">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No expenses found matching your criteria.</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{expense.description}</span>
                      {expense.autoFilled && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          📱 QR
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {expense.date} at {expense.time} • Paid by {expense.paidBy}
                    </div>
                    {expense.location && expense.location !== 'Manual Entry' && (
                      <div className="text-xs text-gray-500 mt-1">
                        📍 {expense.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-lg">₹{expense.amount}</div>
                    <div className="text-sm text-gray-600">₹{expense.perPersonCost.toFixed(2)} each</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
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
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          📥 Export Filtered Data ({filteredExpenses.length} items)
        </button>
      </div>
    </div>
  );
}
