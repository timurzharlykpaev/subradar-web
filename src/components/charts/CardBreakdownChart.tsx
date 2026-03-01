
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PaymentCard } from '@/types';

interface CardBreakdownChartProps {
  data: { cardId: string; card: PaymentCard; amount: number }[];
}

export function CardBreakdownChart({ data }: CardBreakdownChartProps) {
  const chartData = data.map((d) => ({
    name: d.card.nickname || `••••${d.card.last4}`,
    amount: d.amount,
    fill: d.card.color || '#8B5CF6',
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 border border-purple-500/30">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-bold text-purple-400">${payload[0].value.toFixed(2)}/mo</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={24}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}


