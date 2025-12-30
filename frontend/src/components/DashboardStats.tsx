import { Building2, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Stats = {
  totalClinics: number;
  totalOutstanding: number;
  totalCases: number;
  todayIncome: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalClinics: 0,
    totalOutstanding: 0,
    totalCases: 0,
    todayIncome: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total clinics and outstanding
      const { data: clinics } = await supabase
        .from('clinics')
        .select('current_balance, total_cases')
        .eq('is_active', true);

      const totalClinics = clinics?.length || 0;
      const totalOutstanding = clinics?.reduce((sum, c) => sum + Number(c.current_balance), 0) || 0;
      const totalCases = clinics?.reduce((sum, c) => sum + c.total_cases, 0) || 0;

      // Get today's payments
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', today.toISOString());

      const todayIncome = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalClinics,
        totalOutstanding,
        totalCases,
        todayIncome,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Outstanding',
      value: `RM ${stats.totalOutstanding.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-red-500',
    },
    {
      title: 'Today\'s Income',
      value: `RM ${stats.todayIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Cases',
      value: stats.totalCases.toString(),
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Clinics',
      value: stats.totalClinics.toString(),
      icon: Building2,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}