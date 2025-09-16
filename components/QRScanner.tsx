'use client';

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'react-hot-toast';
import { parseUPIQR, getCurrentLocation } from '@/lib/qrParser';
import { QRExpenseData } from '@/types';

interface QRScannerProps {
  onQRScanned: (expense: QRExpenseData) => void;
  onCancel: () => void;
}

export default function QRScanner({ onQRScanned, onCancel }: QRScannerProps): JSX.Element {
  const [scanStatus, setScanStatus] = useState<string>('Point camera at QR code');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleScan = async (result: string): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);
    setScanStatus('Processing QR code...');

    try {
      const qrData = parseUPIQR(result);
      const location = await getCurrentLocation();
      
      // ✅ Fixed - Handle null values properly
      const expenseData: QRExpenseData = {
        description: qrData.shopName ? `Tea at ${qrData.shopName}` : 'Tea',
        merchant: qrData.shopName, // Can be null, that's OK now
        location: location?.address || 'QR Scan Location',
        billRef: qrData.billRef, // Can be null, that's OK now
        amount: qrData.amount || 0,
        hasAmount: qrData.hasAmount,
        qrType: qrData.hasAmount ? 'amount-qr' : 'basic-qr',
        autoFilled: qrData.hasAmount,
        qrSource: result
      };

      if (qrData.hasAmount && qrData.amount) {
        setScanStatus(`✅ Amount ₹${qrData.amount} detected!`);
        toast.success(`QR Scanned! Amount: ₹${qrData.amount}`);
      } else {
        setScanStatus(`ℹ️ Shop details captured, enter amount manually`);
        toast.success('QR Scanned! Please enter amount.');
      }

      setTimeout(() => {
        onQRScanned(expenseData);
      }, 1000);

    } catch (error) {
      setScanStatus('❌ Invalid QR code format');
      toast.error('Invalid QR code. Please scan a payment QR.');
      setTimeout(() => {
        setScanStatus('Point camera at QR code');
        setIsProcessing(false);
      }, 2000);
    }
  };

  // ✅ Fixed - Handle unknown error type
  const handleError = (error: unknown): void => {
    console.log('QR Scanner Error:', error);
    if (error instanceof Error) {
      console.log('Error message:', error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">📱 QR Code Scanner</h3>
        <p className="text-sm text-gray-600 mb-4">{scanStatus}</p>
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
        <Scanner
          onScan={(result) => {
            if (result && result.length > 0) {
              handleScan(result[0].rawValue);
            }
          }}
          onError={handleError} // ✅ Fixed - Now accepts unknown type
          constraints={{ facingMode: 'environment' }}
          styles={{
            container: { width: '100%', height: '100%' }
          }}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>📋 Supports: UPI payment QR codes</p>
        <p>📍 Location will be auto-captured</p>
      </div>

      <button
        onClick={onCancel}
        disabled={isProcessing}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50"
      >
        Cancel Scan
      </button>
    </div>
  );
}
