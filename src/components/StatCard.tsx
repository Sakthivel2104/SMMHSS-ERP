import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color = 'primary' }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="stat-card"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
