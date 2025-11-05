"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Platform growth trends showing users and revenue"

const chartData = [
    { date: "8 Sept", users: 245, revenue: 1850 },
    { date: "15 Sept", users: 280, revenue: 2100 },
    { date: "22 Sept", users: 310, revenue: 2350 },
    { date: "29 Sept", users: 335, revenue: 2580 },
    { date: "6 Oct", users: 365, revenue: 2820 },
]

const chartConfig = {
    users: {
        label: "Users",
        color: "var(--chart-1)",
    },
    revenue: {
        label: "Revenue ($)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function UserRevenueChart() {
    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle>Platform Growth Trends</CardTitle>
                <CardDescription>
                    Tracking user growth and revenue over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="revenue"
                            type="linear"
                            fill="var(--color-revenue)"
                            fillOpacity={0.4}
                            stroke="var(--color-revenue)"
                            stackId="a"
                        />
                        <Area
                            dataKey="users"
                            type="linear"
                            fill="var(--color-users)"
                            fillOpacity={0.4}
                            stroke="var(--color-users)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Trending up by 8.5% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            September - October 2024
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
