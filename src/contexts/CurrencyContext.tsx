import { createContext, useContext, useState, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate to convert 1 USD to this currency
}

const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.5 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertFromUSD: (usdAmount: number) => number;
  formatPrice: (usdAmount: number) => string;
  formatPriceWithCode: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]); // Default to INR

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  // Convert USD amount to current currency
  const convertFromUSD = (usdAmount: number): number => {
    if (!usdAmount || isNaN(usdAmount)) return 0;
    return usdAmount * currentCurrency.rate;
  };

  // Format price with symbol
  const formatPrice = (usdAmount: number): string => {
    if (!usdAmount || isNaN(usdAmount)) return `${currentCurrency.symbol}0`;
    const converted = convertFromUSD(usdAmount);
    
    // Format with locale-appropriate number formatting
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Math.round(converted));
    
    return `${currentCurrency.symbol}${formatted}`;
  };

  // Format price with currency code
  const formatPriceWithCode = (usdAmount: number): string => {
    if (!usdAmount || isNaN(usdAmount)) return `${currentCurrency.code} 0`;
    const converted = convertFromUSD(usdAmount);
    
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Math.round(converted));
    
    return `${currentCurrency.code} ${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      currencies,
      setCurrency,
      convertFromUSD,
      formatPrice,
      formatPriceWithCode
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
