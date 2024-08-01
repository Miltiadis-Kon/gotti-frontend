"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const portfolioData = [
    {
        ticker: "VTI",
        name: "Vanguard Total Stock Market ETF",
        allocation: "15%",
        totalBalance: "$15,000.00",
        fill : "var(--color-VTI)",
    },
    {
        ticker: "VNQ",
        name: "Vanguard Real Estate ETF",
        allocation: "20%",
        totalBalance: "$20,000.00",
        fill: "var(--color-VNQ)"
    },
    {
        ticker: "EFA",
        name: "iShares MSCI EAFE ETF",
        allocation: "30%",
        totalBalance: "$30,000.00",
        fill: "var(--color-EFA)"
    },
    {
        ticker: "VWO",
        name: "Vanguard FTSE Emerging Markets ETF",
        allocation: "15%",
        totalBalance: "$15,000.00",
        fill: "var(--color-VWO)"
    },
    {
        ticker: "TIP",
        name: "iShares TIPS Bond ETF",
        allocation: "20%",
        totalBalance: "$35,000.00",
        fill: "var(--color-TIP)"
    },
];

export function PortofolioAllocation() {
  return (
    <Card className="xl:col-span-2 md:col-span-1" >
    <CardHeader>
      <CardTitle>Portfolio Overview</CardTitle>
      <CardDescription>
      </CardDescription>
    </CardHeader>
    <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Ticker</TableHead>
          <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-right">Allocation</TableHead>
            <TableHead className="text-right">Balace</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolioData.map((ticker) => (
          <TableRow key={ticker.ticker}>
            <TableCell className="font-small">{ticker.ticker}</TableCell>
            <TableCell className="text-left">{ticker.name}</TableCell>
            <TableCell className="text-right">{ticker.allocation}</TableCell>
            <TableCell className="text-right">{ticker.totalBalance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right"></TableCell>
          <TableCell className="text-right"></TableCell>
          <TableCell className="text-right">$100,000.00</TableCell>
        </TableRow>
        </TableFooter>
    </Table>
    </CardContent>
    </Card>
  )
}


import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "./separator";


const chartData = [
  { ticker: "VTI", totalBalance: 15000,allocation:'15%',  fill: "var(--color-VTI)" },
  { ticker: "VNQ", totalBalance: 20000,allocation:'20%', fill: "var(--color-VNQ)" },
  { ticker: "EFA", totalBalance: 30000,allocation:'30%', fill: "var(--color-EFA)" },
  { ticker: "VWO", totalBalance: 15000,allocation:'15%', fill: "var(--color-VWO)" },
  { ticker: "TIP", totalBalance: 35000,allocation:'20%', fill: "var(--color-TIP)" },
]

const chartConfig = {
    totalBalance: {
    label: "totalBalance",
  },
  VTI: {
    label: "VTI",
    color: "hsl(var(--chart-1))",
  },
  VNQ: {
    label: "VNQ",
    color: "hsl(var(--chart-2))",
  },
  EFA: {
    label: "EFA",
    color: "hsl(var(--chart-3))",
  },
  VWO: {
    label: "VWO",
    color: "hsl(var(--chart-4))",
  },
  TIP: {
    label: "TIP",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PortfolioPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Portfolio Coverage</CardTitle>
        <Separator className="bg-slate-500 h-px mt-2 mb-6" />
        </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
             <Pie
              data={chartData}
              innerRadius={40}
              dataKey="totalBalance"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.allocation}
                  </text>
                )
              }}
              nameKey="ticker"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="ticker" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>  
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this sector <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
        </div>
      </CardFooter>
    </Card>
  )
}

export function EquityPieChart() {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-4">
          <CardTitle>Equity Coverage</CardTitle>
          <Separator className="bg-slate-500 h-px mt-2 mb-6" />
          </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
               <Pie
                data={chartData}
                innerRadius={40}
                dataKey="totalBalance"
                labelLine={false}
                nameKey="ticker">
                <LabelList
                dataKey="ticker"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
                </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="ticker" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>  
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this sector <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
          </div>
        </CardFooter>
      </Card>
    )
  }

  export function AssetAllocationPieChart() {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-4">
          <CardTitle>Asset Allocation</CardTitle>
          <Separator className="bg-slate-500 h-px mt-2 mb-6" />
          </CardHeader>
        <CardContent className="flex-1 pb-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
               <Pie
                data={chartData}
                innerRadius={40}
                dataKey="totalBalance"
                labelLine={false}
                nameKey="ticker">
                <LabelList
                dataKey="ticker"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
                </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="ticker" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>  
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this sector <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
          </div>
        </CardFooter>
      </Card>
    )
  }


import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

const sectorchartData = [
  { sector: "Technology", sectorPercentage: 186 },
  { sector: "Agriculture", sectorPercentage: 305 },
  { sector: "Etc", sectorPercentage: 237},
  { sector: "Space", sectorPercentage: 73},
  { sector: "Porn", sectorPercentage: 209 },
  { sector: "June", sectorPercentage: 214},
]

const sectorchartConfig = {
  sectorPercentage: {
    label: "sectorPercentage",
    color: "hsl(var(--chart-5))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function SectorBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Diversification</CardTitle>
     </CardHeader>
      <CardContent>
        <ChartContainer config={sectorchartConfig}>
          <BarChart
            accessibilityLayer
            data={sectorchartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="sector"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="sectorPercentage" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="sectorPercentage"
              layout="vertical"
              fill="var(--color-sectorPercentage)"
              radius={4}
            >
              <LabelList
                dataKey="sector"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="sectorPercentage"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Covering 6/12 sectors in total! <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
            Wide sector coverage protects from inflation!
        </div>
      </CardFooter>
    </Card>
  )
}



import { Line, LineChart} from "recharts"

const anchartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const anchartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ExpectedAnnualReturns() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated Annual Returns</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={anchartConfig}>
          <LineChart
            accessibilityLayer
            data={anchartData}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
