import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartesianGrid, XAxis, Area, AreaChart, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Star } from "lucide-react";
import { color } from "framer-motion";

type StockData = {
  time: string;
  close: number;
};

const TickerChart = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState("1d");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/stock_data"
        );
        const data = response.data;
        const parsedData = JSON.parse(data);
        const closeData = parsedData.Close;
        // Transform the "Close" price from yfinance into an array of time close obj
        const transformedData: StockData[] = Object.keys(closeData).map(
          (timestamp) => {
            const date = new Date(Number(timestamp));
            const formattedDate = `${date
              .getDate()
              .toString()
              .padStart(2, "0")}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`; // Format DD/MM
            return {
              time: formattedDate,
              close: closeData[timestamp],
            };
          }
        );
        setStockData(transformedData);
        console.log("Stock data:", transformedData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }
    fetchData();
  }, [timeRange]);

  const filteredData = useMemo(() => {
    switch (timeRange) {
      case "1w":
        return stockData.slice(-7);
      case "1m":
        return stockData.slice(-30);
      case "3m":
        return stockData.slice(-90);
      case "6m":
        return stockData.slice(-180);
      case "1y":
        return stockData.slice(-365);
      default:
        return stockData;
    }
  }, [stockData, timeRange]);

  const minCloseValue = useMemo(() => {
    return Math.round(
      Math.min(...filteredData.map((data) => data.close)) * 0.9
    ); // Set the minimum close value to 99% of the minimum close value
  }, [filteredData]);

  const maxCloseValue = useMemo(() => {
    return Math.round(
      Math.max(...filteredData.map((data) => data.close)) * 1.01
    ); // Set the maximum close value to 101% of the maximum close value
  }, [filteredData]);

  const chartConfig = {
    close: {
      label: "Close",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const monthToStr = (month: string) => {
    switch (month) {
      case "01":
        return "Jan";
      case "02":
        return "Feb";
      case "03":
        return "Mar";
      case "04":
        return "Apr";
      case "05":
        return "May";
      case "06":
        return "Jun";
      case "07":
        return "Jul";
      case "08":
        return "Aug";
      case "09":
        return "Sep";
      case "10":
        return "Oct";
      case "11":
        return "Nov";
      case "12":
        return "Dec";
      default:
        return month;
    }
  };


  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://images.branddb.wipo.int/brands/qatm/QA502018000125907/6026C697-th.jpg" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">AAPL</h2>
            <p className="text-sm text-gray-500">Apple Inc.</p>
          </div>   
        </div>
        <div className="flex items-end gap-4" >
          <Button className="bg-yellow-300 w-12 h-12 rounded-full" >
          <Star color="black" fill="true" style={{ fontSize: '80%' }}  overflow="visible"  />
          </Button>
        </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => {
                return value;
              }}
              tick={({ x, y, payload }) => {
                const [day, month] = payload.value.split("/");
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
                      <tspan x="0" dy="0">
                        {day}
                      </tspan>
                      <tspan x="0" dy="15">
                        {monthToStr(month)}
                      </tspan>
                    </text>
                  </g>
                );
              }}
            />
            <YAxis
              dataKey="close"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              domain={[minCloseValue, maxCloseValue]} // Set the domain to start from the minimum close value
              tickFormatter={(value) => {
                return `$${value}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="close"
              type="linear"
              fill="var(--color-close)"
              fillOpacity={0.1}
              stroke="var(--color-close)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-center bg-secondary pt-2 pb-2 pl-1 pr-1 rounded-xl w-full gap-2 justify-center ">
          <Button
            variant={timeRange === "1w" ? "default" : "outline"}
            onClick={() => setTimeRange("1w")}
          >
            1W
          </Button>
          <Button
            variant={timeRange === "1m" ? "default" : "outline"}
            onClick={() => setTimeRange("1m")}
          >
            1M
          </Button>
          <Button
            variant={timeRange === "3m" ? "default" : "outline"}
            onClick={() => setTimeRange("3m")}
          >
            3M
          </Button>
          <Button
            variant={timeRange === "6m" ? "default" : "outline"}
            onClick={() => setTimeRange("6m")}
          >
            6M
          </Button>
          <Button
            variant={timeRange === "1y" ? "default" : "outline"}
            onClick={() => setTimeRange("1y")}
          >
            1Y
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TickerChart;
