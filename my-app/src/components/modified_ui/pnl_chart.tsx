"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { month: "January", price: 186, mobile: 80 },
  { month: "February", price: 305, mobile: 200 },
  { month: "March", price: 237, mobile: 120 },
  { month: "April", price: 73, mobile: 190 },
  { month: "May", price: 209, mobile: 130 },
  { month: "June", price: 214, mobile: 140 },
  { month: "July", price: 231, mobile: 150 },

]

const chartConfig = {
  price: {
    label: "USD",
    color: "blue",
  },
  mobile: {
    label: "Mobile",
    color: "red",
  },
} satisfies ChartConfig

export function PnLChart() {
    var percentageChange = Math.round((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price * 100 * 100) / 100;
  return (
    <Card className="lg:max-w-md flex-grow " x-chunk="charts-01-chunk-0"
>
      <CardHeader>
        <CardTitle>Monthly Realised PnL</CardTitle>
        <CardDescription>{chartData[0].month} - {chartData[chartData.length-1].month} 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line"/>}
            />
            <Line
              dataKey="price"
              type="natural"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-price)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
         Account is trending {percentageChange}% since {chartData[0].month} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing account summary for the past {chartData.length} months
        </div>
      </CardFooter>
    </Card>
  )
}
