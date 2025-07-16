import { createContext, useContext, useState, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to INR
}

const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 0.044 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.016 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 0.016 },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  currencies: Currency[];
  setCurrency: (currency: Currency) => void;
  convertPrice: (inrAmount: number) => string;
  formatPrice: (inrAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const convertPrice = (inrAmount: number): string => {
    const converted = inrAmount * currentCurrency.rate;
    return converted.toFixed(2);
  };

  const formatPrice = (inrAmount: number): string => {
    const converted = convertPrice(inrAmount);
    return `${currentCurrency.symbol}${converted}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      currencies,
      setCurrency,
      convertPrice,
      formatPrice
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