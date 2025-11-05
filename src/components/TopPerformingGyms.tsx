import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '../axios/axios-config';

interface Gym {
    _id: string;
    name: string;
    gymId: string;
    price: number;
    rating: number;
    address: string;
}

interface GymPerformance {
    gym: Gym;
    userCount: number;
    utilization: number;
    revenue: number;
    growthRate: number;
}

export function TopPerformingGyms() {
    const [topGyms, setTopGyms] = useState<GymPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopPerformingGyms();
    }, []);

    const fetchTopPerformingGyms = async () => {
        try {
            setLoading(true);
            // Fetch gyms data
            const response = await api.get('/gyms');
            const gyms: Gym[] = response.data;

            // Calculate performance metrics for each gym
            // In a real scenario, these would come from the API
            const performanceData: GymPerformance[] = gyms.slice(0, 5).map((gym, index) => {
                // Mock data for demonstration - replace with actual API data
                const baseUsers = 2847 - (index * 200);
                const baseUtilization = 94 - (index * 3);
                const baseRevenue = 128 - (index * 10);
                const baseGrowth = 18.2 + (index * 2);

                return {
                    gym,
                    userCount: baseUsers,
                    utilization: baseUtilization,
                    revenue: baseRevenue * 1000,
                    growthRate: baseGrowth,
                };
            });

            // Sort by revenue (already sorted in mock, but would need this for real data)
            performanceData.sort((a, b) => b.revenue - a.revenue);

            setTopGyms(performanceData.slice(0, 5));
        } catch (error) {
            console.error('Error fetching top performing gyms:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatRevenue = (revenue: number) => {
        if (revenue >= 1000) {
            return `$${Math.round(revenue / 1000)}k`;
        }
        return `$${revenue}`;
    };

    const formatGrowth = (growth: number) => {
        return `+${growth.toFixed(1)}%`;
    };

    if (loading) {
        return (
            <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Top Performing Gyms</CardTitle>
                    <CardDescription className="text-slate-400">
                        Loading gym performance data...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-20 bg-slate-700/50 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="text-white">Top Performing Gyms</CardTitle>
                <CardDescription className="text-slate-400">
                    Based on revenue and user engagement
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topGyms.map((item, index) => (
                        <div
                            key={item.gym._id}
                            className="bg-slate-700/40 hover:bg-slate-700/60 rounded-lg p-4 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                    {/* Rank Badge */}
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-slate-600/50 flex items-center justify-center">
                                            <span className="text-lg font-bold text-slate-300">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Gym Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-base truncate">
                                            {item.gym.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm mt-0.5">
                                            {item.userCount.toLocaleString()} users • {item.utilization}% utilization
                                        </p>
                                    </div>

                                    {/* Revenue & Growth */}
                                    <div className="shrink-0 text-right">
                                        <div className="text-white font-bold text-lg">
                                            {formatRevenue(item.revenue)}
                                        </div>
                                        <div className="text-green-400 text-sm font-medium mt-0.5">
                                            {formatGrowth(item.growthRate)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
