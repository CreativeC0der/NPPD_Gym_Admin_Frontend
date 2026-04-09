import React, { useEffect, useState } from 'react';
import api from '@/axios/axios-config';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { showErrorToast } from '@/utils/toast';
import {
    AlertTriangle,
    CalendarRange,
    Mail,
    Phone,
    RefreshCw,
    Search,
    ShieldAlert,
    TrendingDown,
    Users,
} from 'lucide-react';

interface DhiUser {
    _id: string;
    name?: string;
    phone?: string;
    email?: string;
    role?: string;
}

interface DhiDomain {
    _id: string;
    domainId?: string;
    domainLabel?: string;
    domainIcon?: string;
    domainColor?: string;
    domainGradientColors?: string[];
}

interface DhiQuestion {
    _id: string;
    label?: string;
    field?: string;
    unit?: string;
}

interface DhiMetric {
    _id: string;
    questionId?: DhiQuestion;
    averageValue?: number;
    normalizedAverageValue?: number;
    normalizedAverageWeightedValue?: number;
    weight?: number;
}

interface DhiRecord {
    _id: string;
    userId?: DhiUser;
    domain?: DhiDomain;
    windowType?: string;
    windowStart?: string;
    windowEnd?: string;
    dataPointCount?: number;
    metrics?: DhiMetric[];
    dhi?: number;
    status?: string;
    calculatedAt?: string;
    createdAt?: string;
}

interface DhiApiResponse {
    success: boolean;
    total?: number;
    dhi?: DhiRecord[];
}

const getInitials = (name?: string) => {
    const safeName = name?.trim() || 'Critical User';
    return safeName
        .split(' ')
        .map((part) => part[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CU';
};

const formatDateTime = (value?: string) => {
    if (!value) return 'Not available';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Not available';

    return parsed.toLocaleString();
};

const formatWindowType = (windowType?: string) => {
    if (!windowType) return 'Unknown window';
    return windowType.replace(/_/g, ' ');
};

const formatMetricValue = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

const getGradientStyle = (domain?: DhiDomain) => {
    const colors = domain?.domainGradientColors?.filter(Boolean) ?? [];

    if (colors.length >= 2) {
        return { backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` };
    }

    if (domain?.domainColor) {
        return { backgroundColor: domain.domainColor };
    }

    return { backgroundColor: '#dc2626' };
};

const ConsultantAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<DhiRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAlerts = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const response = await api.get<DhiApiResponse>('dhi/consultant-red-alerts');
            const allAlerts = response?.data?.dhi ?? [];
            const sortedAlerts = allAlerts.sort((first, second) => {
                const firstScore = typeof first?.dhi === 'number' ? first.dhi : Number.POSITIVE_INFINITY;
                const secondScore =
                    typeof second?.dhi === 'number' ? second.dhi : Number.POSITIVE_INFINITY;

                if (firstScore !== secondScore) {
                    return firstScore - secondScore;
                }

                const firstDate = first?.calculatedAt ? new Date(first.calculatedAt).getTime() : 0;
                const secondDate = second?.calculatedAt ? new Date(second.calculatedAt).getTime() : 0;

                return secondDate - firstDate;
            });

            setAlerts(sortedAlerts);
        } catch (error) {
            console.error('Error fetching DHI alerts:', error);
            showErrorToast('Failed to load red alerts');
            setAlerts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const filteredAlerts = alerts.filter((record) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        const user = record.userId;
        const domain = record.domain;

        return [
            user?.name,
            user?.email,
            user?.phone,
            domain?.domainLabel,
            domain?.domainId,
            record?.status,
        ]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(query));
    });

    const uniqueUsers = new Set(alerts.map((record) => record.userId?._id).filter(Boolean)).size;
    const averageDhi =
        alerts.length > 0
            ? alerts.reduce((total, record) => total + (record.dhi ?? 0), 0) / alerts.length
            : 0;

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-300">
                            <ShieldAlert className="h-4 w-4" />
                            Critical DHI Monitoring
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Consultant Red Alerts</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">
                            Review users with critical red DHI status and see the domain signals that
                            need immediate follow-up.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative min-w-[260px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search by user, email, phone, or domain"
                                className="border-slate-800 bg-slate-900 pl-9 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fetchAlerts(false)}
                            disabled={refreshing}
                            className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-red-500/20 bg-slate-900 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-slate-400">Open red alerts</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl text-white">
                                <AlertTriangle className="h-7 w-7 text-red-400" />
                                {alerts.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-slate-400">Affected users</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl text-white">
                                <Users className="h-7 w-7 text-orange-300" />
                                {uniqueUsers}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-slate-400">Average DHI score</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-3xl text-white">
                                <TrendingDown className="h-7 w-7 text-amber-300" />
                                {alerts.length > 0 ? averageDhi.toFixed(2) : '0.00'}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
                        <div className="text-slate-400">Loading red alerts...</div>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                            <ShieldAlert className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">
                            {alerts.length === 0 ? 'No critical red alerts right now' : 'No alerts match your search'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            {alerts.length === 0
                                ? 'This page will surface users whose DHI status is marked red.'
                                : 'Try a different user name, email, phone number, or domain search.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {filteredAlerts.map((record) => (
                            <Card
                                key={record._id}
                                className="overflow-hidden border-red-500/15 bg-slate-900 text-white shadow-[0_20px_60px_-35px_rgba(239,68,68,0.45)]"
                            >
                                <div
                                    className="h-1 w-full"
                                    style={getGradientStyle(record.domain)}
                                />
                                <CardHeader className="gap-4 pb-4">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-14 w-14 border border-slate-700 bg-slate-800">
                                                <AvatarFallback className="bg-slate-800 text-base font-semibold text-white">
                                                    {getInitials(record.userId?.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <CardTitle className="text-xl text-white">
                                                    {record.userId?.name || 'Unnamed user'}
                                                </CardTitle>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Badge className="border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20">
                                                        Critical
                                                    </Badge>
                                                    <Badge className="border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-800">
                                                        {formatWindowType(record.windowType)}
                                                    </Badge>
                                                    <Badge className="border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-800">
                                                        {record.domain?.domainIcon || '•'}{' '}
                                                        {record.domain?.domainLabel || 'Unknown domain'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right">
                                            <div className="text-xs uppercase tracking-[0.18em] text-red-300">
                                                DHI Score
                                            </div>
                                            <div className="mt-1 text-3xl font-bold text-white">
                                                {typeof record.dhi === 'number' ? record.dhi.toFixed(2) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                                                <Mail className="h-4 w-4 text-slate-500" />
                                                Email
                                            </div>
                                            <p className="break-all text-sm text-white">
                                                {record.userId?.email || 'Not available'}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                                                <Phone className="h-4 w-4 text-slate-500" />
                                                Phone
                                            </div>
                                            <p className="text-sm text-white">
                                                {record.userId?.phone || 'Not available'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                            <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                                                Data points
                                            </div>
                                            <div className="mt-2 text-lg font-semibold text-white">
                                                {record.dataPointCount ?? 0}
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                            <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                                                Window start
                                            </div>
                                            <div className="mt-2 text-sm text-white">
                                                {formatDateTime(record.windowStart)}
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                            <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                                                Last calculated
                                            </div>
                                            <div className="mt-2 text-sm text-white">
                                                {formatDateTime(record.calculatedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                                            <CalendarRange className="h-4 w-4 text-red-300" />
                                            Signal breakdown
                                        </div>

                                        {record.metrics && record.metrics.length > 0 ? (
                                            <div className="space-y-3">
                                                {record.metrics.map((metric) => (
                                                    <div
                                                        key={metric._id}
                                                        className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"
                                                    >
                                                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                            <div>
                                                                <p className="font-medium text-white">
                                                                    {metric.questionId?.label || 'Unnamed metric'}
                                                                </p>
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {metric.questionId?.field || 'Field unavailable'}
                                                                </p>
                                                            </div>

                                                            <div className="grid gap-3 sm:grid-cols-3">
                                                                <div>
                                                                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                                                        Average value
                                                                    </div>
                                                                    <div className="mt-1 text-sm font-semibold text-white">
                                                                        {formatMetricValue(metric.averageValue)}{' '}
                                                                        {metric.questionId?.unit || ''}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                                                        Normalized average
                                                                    </div>
                                                                    <div className="mt-1 text-sm font-semibold text-white">
                                                                        {formatMetricValue(metric.normalizedAverageValue)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                                                        Normalized weighted
                                                                    </div>
                                                                    <div className="mt-1 text-sm font-semibold text-white">
                                                                        {formatMetricValue(metric.normalizedAverageWeightedValue)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                                                        Weight
                                                                    </div>
                                                                    <div className="mt-1 text-sm font-semibold text-white">
                                                                        {formatMetricValue(metric.weight)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">
                                                No metric details were returned for this alert.
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultantAlerts;
