import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";
import { DollarSign } from "lucide-react";

export function CurrencySelector() {
  const { currentCurrency, currencies, setCurrency } = useCurrency();

  return (
    <Select
      value={currentCurrency.code}
      onValueChange={(value) => {
        const currency = currencies.find(c => c.code === value);
        if (currency) setCurrency(currency);
      }}
    >
      <SelectTrigger className="w-28 h-8 text-xs bg-white/90 border-white/50">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{currency.symbol}</span>
              <span>{currency.code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}