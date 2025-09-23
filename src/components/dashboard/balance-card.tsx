import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, cn } from '@/lib/utils';

type BalanceCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export default function BalanceCard({ title, value, icon: Icon }: BalanceCardProps) {
    const isPositive = value >= 0;
    const valueColor = isPositive ? 'text-green-500' : 'text-red-500';

    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className='h-5 w-5 text-muted-foreground' />
        </CardHeader>
        <CardContent>
            <div className={cn("text-2xl font-bold", valueColor)}>
                {formatCurrency(value)}
            </div>
        </CardContent>
        </Card>
    );
}
