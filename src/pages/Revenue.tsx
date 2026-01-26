import React from 'react';
import { Badge } from '../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../components/ui/chart';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Member {
    name: string;
    status: 'renewal-risk' | 'inactive' | 'upsell';
    daysToExpiry: number;
    engagement: number;
    sessions: number;
    revenue: number;
    trainer: string;
    action: string;
}

const dummyMembers: Member[] = [
    {
        name: 'Aarav Sharma',
        status: 'renewal-risk',
        daysToExpiry: 12,
        engagement: 25,
        sessions: 4,
        revenue: 15000,
        trainer: 'Priya Singh',
        action: 'Call & Offer Retention',
    },
    {
        name: 'Ananya Patel',
        status: 'inactive',
        daysToExpiry: 45,
        engagement: 10,
        sessions: 1,
        revenue: 10000,
        trainer: 'Vikram Raj',
        action: 'Reactivate with Promo',
    },
    {
        name: 'Rohan Gupta',
        status: 'upsell',
        daysToExpiry: 90,
        engagement: 89,
        sessions: 22,
        revenue: 20000,
        trainer: 'Sara Ali',
        action: 'Pitch Premium Package',
    },
    {
        name: 'Isha Desai',
        status: 'renewal-risk',
        daysToExpiry: 5,
        engagement: 40,
        sessions: 8,
        revenue: 12000,
        trainer: 'Rahul Verma',
        action: 'Urgent Renewal Call',
    },
    {
        name: 'Karan Malhotra',
        status: 'inactive',
        daysToExpiry: 60,
        engagement: 5,
        sessions: 0,
        revenue: 18000,
        trainer: 'Priya Singh',
        action: 'Re-engagement Email',
    },
    {
        name: 'Nikhil Kumar',
        status: 'upsell',
        daysToExpiry: 110,
        engagement: 92,
        sessions: 28,
        revenue: 25000,
        trainer: 'Vikram Raj',
        action: 'Offer Personal Training',
    },
    {
        name: 'Sanya Reddy',
        status: 'renewal-risk',
        daysToExpiry: 21,
        engagement: 30,
        sessions: 5,
        revenue: 14000,
        trainer: 'Sara Ali',
        action: 'Schedule Check-in',
    },
    {
        name: 'Arjun Kapoor',
        status: 'inactive',
        daysToExpiry: 30,
        engagement: 15,
        sessions: 2,
        revenue: 11000,
        trainer: 'Rahul Verma',
        action: 'Send Win-back Offer',
    },
    {
        name: 'Meera Joshi',
        status: 'upsell',
        daysToExpiry: 85,
        engagement: 88,
        sessions: 24,
        revenue: 22000,
        trainer: 'Priya Singh',
        action: 'Suggest Nutrition Plan',
    },
    {
        name: 'Kabir Singh',
        status: 'renewal-risk',
        daysToExpiry: 8,
        engagement: 20,
        sessions: 3,
        revenue: 16000,
        trainer: 'Vikram Raj',
        action: 'Discuss Membership Options',
    },
];

const renewalTrendData = [
    { month: 'Jan', rate: 68 },
    { month: 'Feb', rate: 70 },
    { month: 'Mar', rate: 69 },
    { month: 'Apr', rate: 71 },
    { month: 'May', rate: 73 },
    { month: 'Jun', rate: 72 },
];

const chartConfig = {
    rate: {
        label: 'Renewal Rate',
        color: 'hsl(142, 76%, 36%)',
    },
};

const Revenue: React.FC = () => {
    const getStatusBadge = (status: Member['status']) => {
        switch (status) {
            case 'renewal-risk':
                return (
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                        Renewal Risk
                    </Badge>
                );
            case 'inactive':
                return (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20">
                        Inactive
                    </Badge>
                );
            case 'upsell':
                return (
                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20">
                        Upsell
                    </Badge>
                );
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Revenue Intelligence</h1>
                <p className="text-slate-400">Monitor revenue risks and opportunities</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Revenue at Risk (Next 30 Days)</div>
                    <div className="text-4xl font-bold text-red-500 mb-2">₹4,85,000</div>
                    <div className="text-slate-400 text-sm">Expiring Membership Value</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">High Renewal Risk Members</div>
                    <div className="text-4xl font-bold text-yellow-500 mb-2">18</div>
                    <div className="text-slate-400 text-sm">Low Engagement + Expiring</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Inactive Revenue Pool</div>
                    <div className="text-4xl font-bold text-orange-500 mb-2">₹2,10,000</div>
                    <div className="text-slate-400 text-sm">Active but Low Attendance</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Upsell Eligible Members</div>
                    <div className="text-4xl font-bold text-green-500 mb-2">26</div>
                    <div className="text-slate-400 text-sm">High Engagement Milestones</div>
                </div>
            </div>

            {/* Member Details Table */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Member Details</h2>
                    <div className="text-sm text-slate-400">{dummyMembers.length} members</div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-slate-800/50">
                                <TableHead className="text-slate-400 font-semibold">Member Name</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Days to Expiry</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Engagement %</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Sessions (30d)</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Revenue Value (₹)</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Assigned Trainer</TableHead>
                                <TableHead className="text-slate-400 font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyMembers.map((member, index) => (
                                <TableRow
                                    key={index}
                                    className="border-slate-800 hover:bg-slate-800/30"
                                >
                                    <TableCell className="text-white font-medium">{member.name}</TableCell>
                                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                                    <TableCell className="text-slate-300">{member.daysToExpiry} Days</TableCell>
                                    <TableCell className="text-slate-300">{member.engagement}%</TableCell>
                                    <TableCell className="text-slate-300">{member.sessions}</TableCell>
                                    <TableCell className="text-white font-medium">
                                        {formatCurrency(member.revenue)}
                                    </TableCell>
                                    <TableCell className="text-slate-300">{member.trainer}</TableCell>
                                    <TableCell className="text-slate-300 text-sm">{member.action}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Renewal Rate</div>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-white">72%</span>
                        <div className="flex items-center text-green-400">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span className="text-sm">4.2%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Revenue Recovered (MTD)</div>
                    <div className="text-3xl font-bold text-white">₹1,35,000</div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="text-slate-400 text-sm mb-2">Renewal Trend - Last 6 Months</div>
                    <ChartContainer config={chartConfig} className="h-[120px] mt-2">
                        <LineChart data={renewalTrendData}>
                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={{ stroke: '#475569' }}
                            />
                            <YAxis
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={{ stroke: '#475569' }}
                                domain={[65, 75]}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="hsl(142, 76%, 36%)"
                                strokeWidth={2}
                                dot={{ fill: 'hsl(142, 76%, 36%)', r: 3 }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default Revenue;

