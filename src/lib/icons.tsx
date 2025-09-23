import {
  LucideIcon,
  Utensils,
  Home,
  Car,
  HeartPulse,
  Film,
  Shirt,
  GraduationCap,
  ShoppingCart,
  Receipt,
  CircleDollarSign,
  Briefcase,
  TrendingUp,
  Shapes,
} from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  // Expenses
  Alimentação: Utensils,
  Moradia: Home,
  Transporte: Car,
  Saúde: HeartPulse,
  Lazer: Film,
  Vestuário: Shirt,
  Educação: GraduationCap,
  Supermercado: ShoppingCart,
  Contas: Receipt,
  // Income
  Salário: Briefcase,
  'Renda Extra': CircleDollarSign,
  Investimentos: TrendingUp,
  // Default
  Outros: Shapes,
};

export const getCategoryIcon = (category: string): LucideIcon => {
  return categoryIcons[category] || Shapes;
};
