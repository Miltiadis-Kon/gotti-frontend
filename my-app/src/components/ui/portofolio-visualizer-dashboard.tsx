"use client";

import * as React from "react";
import { Info, TrendingDown, TrendingUp, WalletMinimal } from "lucide-react";
import {
  Label,
  Pie,
  PieChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./button";
import { link } from "fs";
const chartData = [
  { browser: "chrome", ticker: 275, fill: "var(--color-chrome)" },
  { browser: "safari", ticker: 200, fill: "var(--color-safari)" },
  { browser: "firefox", ticker: 287, fill: "var(--color-firefox)" },
  { browser: "edge", ticker: 173, fill: "var(--color-edge)" },
  { browser: "other", ticker: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  ticker: {
    label: "Positions",
  },
  chrome: {
    label: "AAPL",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "AMZN",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "TSLA",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "GOOGL",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PorotfolioPieChart() {
  const totalticker = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.ticker, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portofolio stock Coverage</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="ticker"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          6.6%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Annual Return
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <WalletMinimal size={16} color="hsl(var(--notification))" />
          <span className="text-primary">
            Portofolio contains a total of 16 stocks
          </span>
        </div>
        <div className="leading-none text-muted-foreground flex flex-row items-center gap-1 justify-start ">
          <Info size={16} color="hsl(var(--info))" />
          To see the full report
          <Button className="btn -ml-4 " variant={"link"}>
            click here
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const snp_portofolio_data = [
  { month: "January", portofolio: 0, snp500: 0 },
  { month: "February", portofolio: 500, snp500: 600 },
  { month: "March", portofolio: 1235, snp500: 1554 },
  { month: "April", portofolio: -1535, snp500: -1362 },
  { month: "May", portofolio: 1000, snp500: 800 },
  { month: "June", portofolio: 2200, snp500: 2086 },
];

const snp_chartConfig = {
  portofolio: {
    label: "portofolio",
    color: "hsl(var(--chart-5))",
  },
  snp500: {
    label: "snp500",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function returnPercentage() {
  const totalDifference = snp_portofolio_data[snp_portofolio_data.length-1].portofolio - snp_portofolio_data[snp_portofolio_data.length-1].snp500;
  const averageDifference = totalDifference / snp_portofolio_data.length;
  return averageDifference;
}

export function PortofolioReturnChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth</CardTitle>
        <CardDescription>
          Showing total ticker for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={snp_chartConfig}>
          <AreaChart
            accessibilityLayer
            data={snp_portofolio_data}
            margin={{
              left: 12,
              right: 12,
            }}

          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
      <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="portofolio"
              type="natural"
              fill="var(--color-portofolio)"
              fillOpacity={0.1}
              stroke="var(--color-portofolio)"
              stackId="b"
            />
            <Area
              dataKey="snp500"
              type="natural"
              fill="var(--color-snp500)"
              fillOpacity={0.1}
              stroke="var(--color-snp500)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Your portofolio is{" "}
            {returnPercentage() > 0 ? (
              <p style={{ color: "hsl(var(--success))" }}>outperforming</p>
            ) : (
              <p style={{ color: "hsl(var(--destructive))" }}>
                underperforming
              </p>
            )}{" "}
            S&P 500 by {Math.abs(returnPercentage()).toFixed(2)}%{" "}
            {returnPercentage() > 0 ? (
              <TrendingUp size={16} color="hsl(var(--success))" />
            ) : (
              <TrendingDown size={16} color="hsl(var(--destructive))" />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const metricData = [
  {
    metric: "Start Balance",
    gotti_metric: "$10000.00",
    snp_metric: "$10000.00",
  },
  {
    metric: "End Balance",
    gotti_metric: "$12200.00",
    snp_metric: "$12086.00",
  },
  {
    metric: "Annualized Return (CAGR)",
    gotti_metric: "22.00%",
    snp_metric: "20.86%",
  },
  {
    metric: "Sharpe Ratio",
    gotti_metric: "1.2",
    snp_metric: "1.1",
  },
  {
    metric: "Max Drawdown",
    gotti_metric: "5%",
    snp_metric: "6%",
  },
  {
    metric: "Volatility",
    gotti_metric: "10%",
    snp_metric: "11%"
  }
]

export function PortofolioDifferenceTable() {
  return (
    <Card>
    <CardHeader>
      <CardTitle>Portfolio Growth</CardTitle>
      <CardDescription>
        Showing total ticker for the last 6 months
      </CardDescription>
    </CardHeader>
    <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Metric</TableHead>
          <TableHead className="text-right">My Portfolio</TableHead>
          <TableHead className="text-right">S&P 500</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metricData.map((metric) => (
          <TableRow key={metric.metric}>
            <TableCell className="font-medium">{metric.metric}</TableCell>
            <TableCell className="text-right">{metric.gotti_metric}</TableCell>
            <TableCell className="text-right">{metric.snp_metric}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </CardContent>
    </Card>
  )
}




export function PortofolioVisualizerDashboard() {
  return (
    <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent ">
      <PortofolioReturnChart />
      <PorotfolioPieChart />
      <PortofolioDifferenceTable />
    </div>
  );
}
