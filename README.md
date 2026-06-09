# 🍵 Expense Tracker

A modern, intuitive expense tracking application built for teams to split tea and snack expenses fairly. Features QR code scanning for UPI payments, real-time balance tracking, and comprehensive expense analytics.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **📱 QR Code Scanning** - Scan UPI payment QR codes to auto-capture expense details
- **👥 Team Management** - Add and manage team members dynamically
- **⚖️ Fair Splitting** - Automatic expense splitting among active members
- **💰 Balance Tracking** - Real-time balance overview showing who owes whom
- **📊 Expense History** - Detailed analytics with filtering and search
- **📍 Location Capture** - Auto-capture location when adding expenses
- **💾 Local Storage** - Data persists in browser localStorage
- **🎨 Modern UI** - Beautiful gradient design with Tailwind CSS
- **📱 Responsive** - Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.1.3
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Custom components with Lucide React icons
- **QR Scanning**: @yudiel/react-qr-scanner
- **Notifications**: react-hot-toast
- **State Management**: React hooks (useState, useEffect)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expensive-tracker.git
cd expensive-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Usage

### Getting Started

1. **Add Team Members**: Start by adding your team members who will be splitting expenses
2. **Add Expenses**: Choose between:
   - **QR Scan**: Scan a UPI payment QR code to auto-capture details
   - **Manual Entry**: Manually enter expense details
3. **View Balances**: Check the balance overview to see who owes whom
4. **Track History**: View detailed expense history with analytics

### QR Code Scanning

- Supports UPI payment QR codes
- Auto-captures merchant name, amount (if available), and location
- Requires camera permissions and HTTPS (required for iOS)
- Works best with payment QR codes from tea shops, cafes, etc.

### Expense Management

- Quick amount buttons for common tea prices (₹60, ₹80, ₹100, ₹120)
- Per-person cost calculation
- Description and location tracking
- Date and time auto-capture

### Analytics

- Filter expenses by year, month, member, or date range
- Search by description, location, or payer
- View spending breakdown by member
- Export filtered expenses to CSV

## 📁 Project Structure

```
expensive-tracker/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main application page
├── components/
│   ├── BalanceView.tsx     # Balance overview component
│   ├── ExpenseForm.tsx     # Manual expense entry form
│   ├── ExpenseHistory.tsx  # Expense history with analytics
│   ├── MemberManager.tsx   # Team member management
│   └── QRScanner.tsx       # QR code scanner
├── lib/
│   ├── qrParser.ts         # UPI QR code parsing logic
│   └── utils.ts            # Utility functions (split calculations)
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The app uses localStorage for data persistence.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new):

```bash
vercel deploy
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

**Note**: QR code scanning requires HTTPS, which is automatically provided by most hosting platforms.

## 📱 Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari (iOS requires HTTPS and explicit camera permission)
- Mobile browsers

## 🔒 Privacy

- All data is stored locally in your browser's localStorage
- No data is sent to external servers
- QR code scanning happens entirely in the browser
- Location capture requires user permission

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🐛 Known Issues

- QR scanning may not work on iOS without HTTPS
- Camera permissions must be granted for QR scanning
- Location capture may not work in all browsers

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI icons from [Lucide](https://lucide.dev)
- QR scanning powered by [@yudiel/react-qr-scanner](https://github.com/YudielS/react-qr-scanner)
