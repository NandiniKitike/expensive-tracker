'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { QRExpenseData } from '@/types';

interface ExpenseFormProps {
  onSubmit: (expense: QRExpenseData) => void;
  members: string[];
  initialData?: QRExpenseData;
}

export default function ExpenseForm({ onSubmit, members, initialData }: ExpenseFormProps): JSX.Element {
  const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || '');
  const [description, setDescription] = useState<string>(initialData?.description || 'Tea');
  const [paidBy, setPaidBy] = useState<string>(initialData?.paidBy || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!amount || !paidBy) {
      toast.error('Please enter amount and select who paid');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // ✅ Now paidBy is recognized as a valid property
    const expenseData: QRExpenseData = {
      ...initialData,
      amount: parseFloat(amount),
      description: description || 'Tea',
      paidBy, // ✅ No TypeScript error
      location: initialData?.location || 'Manual Entry',
      autoFilled: initialData?.autoFilled || false
    };

    onSubmit(expenseData);

    // Reset form if no initial data
    if (!initialData) {
      setAmount('');
      setDescription('Tea');
      setPaidBy('');
    }
  };

  const quickAmounts = [60, 80, 100, 120];

  return (
    <div className="space-y-4">
      {initialData?.location && initialData.location !== 'Manual Entry' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            📱 <strong>Auto-captured:</strong> {initialData.merchant || 'Tea Shop'}
          </p>
          <p className="text-xs text-blue-600">📍 {initialData.location}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Amount Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amounts
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => setAmount(quickAmount.toString())}
                className={`p-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                  amount === quickAmount.toString()
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹) *
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            className="w-full px-4 py-3 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="100"
            min="0"
            step="0.01"
            autoFocus={!initialData?.amount}
          />
          {amount && (
            <p className="mt-1 text-sm text-gray-600">
              ₹{(parseFloat(amount) / members.length).toFixed(2)} per person
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Tea description"
          />
        </div>

        {/* Who Paid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who Paid? *
          </label>
          <select
            value={paidBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaidBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select person</option>
            {members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || !paidBy}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           Add Expense
        </button>
      </form>
    </div>
  );
}
