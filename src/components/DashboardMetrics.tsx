import React from 'react';
import { Building2, Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardMetricsData {
    totalGyms: number;
    gymsGrowth: number;
    totalUsers: number;
    usersGrowth: number;
    totalConsultants: number;
    activeConsultants: number;
    consultantsGrowth: number;
    monthlyRevenue: number;
    revenueGrowth: number;
}

interface DashboardMetricsProps {
    metrics: DashboardMetricsData | null;
    loading: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, loading }) => {
    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`;
        }
        return `$${value}`;
    };

    const formatNumber = (value: number) => {
        return value.toLocaleString();
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-pulse">
                        <div className="h-20 bg-slate-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 text-center mb-8">
                <p className="text-slate-400">Failed to load dashboard metrics</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Gyms Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 hover:border-blue-500 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Building2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-slate-400 font-medium">Total Gyms</h3>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-bold text-white">{formatNumber(metrics.totalGyms)}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm font-semibold">+{metrics.gymsGrowth}%</span>
                        <span className="text-slate-500 text-sm">vs last period</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.gymsGrowth > 100 ? 100 : metrics.gymsGrowth}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Total Users Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 hover:border-green-500 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Users className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-slate-400 font-medium">Total Users</h3>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-bold text-white">{formatNumber(metrics.totalUsers)}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm font-semibold">+{metrics.usersGrowth}%</span>
                        <span className="text-slate-500 text-sm">growth rate</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.usersGrowth > 100 ? 100 : metrics.usersGrowth}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Consultants Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 hover:border-purple-500 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <UserCheck className="h-6 w-6 text-purple-400" />
                        </div>
                        <h3 className="text-slate-400 font-medium">Consultants</h3>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-bold text-white">{formatNumber(metrics.totalConsultants)}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm font-semibold">+{metrics.consultantsGrowth}%</span>
                        <span className="text-slate-500 text-sm">growth rate</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.consultantsGrowth > 100 ? 100 : metrics.consultantsGrowth}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 hover:border-yellow-500 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <DollarSign className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-slate-400 font-medium">Monthly Revenue</h3>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-bold text-white">{formatCurrency(metrics.monthlyRevenue)}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm font-semibold">+{metrics.revenueGrowth}%</span>
                        <span className="text-slate-500 text-sm">revenue growth</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${metrics.revenueGrowth > 100 ? 100 : metrics.revenueGrowth}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardMetrics;
export type { DashboardMetricsData };
