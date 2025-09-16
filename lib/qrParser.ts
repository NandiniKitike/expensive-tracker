import { QRData } from '@/types';

export function parseUPIQR(qrString: string): QRData {
  try {
    if (!qrString.startsWith('upi://pay?')) {
      throw new Error('Not a UPI QR code');
    }

    const urlParams = new URLSearchParams(qrString.split('?')[1]);
    const amount = urlParams.get('am');
    
    return {
      shopName: urlParams.get('pn'),
      amount: amount ? parseFloat(amount) : null,
      merchantUPI: urlParams.get('pa'),
      billRef: urlParams.get('tr'),
      hasAmount: !!amount
    };
  } catch (error) {
    throw new Error('Invalid QR code format');
  }
}

export const getCurrentLocation = (): Promise<{address: string}> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const address = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          resolve({ address });
        },
        () => resolve({ address: 'Location unavailable' })
      );
    } else {
      resolve({ address: 'Location not supported' });
    }
  });
};
