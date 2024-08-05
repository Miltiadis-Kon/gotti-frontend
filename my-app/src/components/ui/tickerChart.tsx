
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, XAxis, Area,AreaChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';


type StockData = {
    time: string;
    close: number;
  };

const TickerChart = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [timeRange, setTimeRange] = useState('1d');

 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/stock_data');
      const data = response.data;
      const parsedData = JSON.parse(data);
      const closeData = parsedData.Close;
        // Transform the "Close" price from yfinance into an array of time close obj
        const transformedData: StockData[] = Object.keys(closeData).map((timestamp) => {
            const date = new Date(Number(timestamp));
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Format DD/MM
            return {
              time: formattedDate,
              close: closeData[timestamp],
            };
          });
        setStockData(transformedData);
        console.log('Stock data:', transformedData); 
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }
  fetchData();
}, [timeRange]);

  const filteredData = useMemo(() => {
    switch (timeRange) {
      case '1w':
        return stockData.slice(-7);
      case '1m':
        return stockData.slice(-30);
      case '3m':
        return stockData.slice(-90);
      case '6m':
        return stockData.slice(-180);
      case '1y':
        return stockData.slice(-365);
      default:
        return stockData;
    }
  }, [stockData, timeRange]);


  const chartConfig = {
    close: {
      label: "Close",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;


  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>AMZN Stock Price</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant={timeRange === '1w' ? 'default' : 'outline'} onClick={() => {setTimeRange('1w'); console.log(filteredData); } }>
            1D
          </Button>
          <Button variant={timeRange === '1m' ? 'default' : 'outline'} onClick={() => setTimeRange('1m')}>
            1W
          </Button>
          <Button variant={timeRange === '3m' ? 'default' : 'outline'} onClick={() => setTimeRange('3m')}>
            1M
          </Button>
          <Button variant={timeRange === '6m' ? 'default' : 'outline'} onClick={() => setTimeRange('6m')}>
            6M
          </Button>
          <Button variant={timeRange === '1y' ? 'default' : 'outline'} onClick={() => setTimeRange('1y')}>
            1Y
          </Button>
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => {
                const totalTicks = filteredData.length;
                console.log('Total ticks:', totalTicks);
                if(index===0){
                    return value;
                }
                if(index === totalTicks - 1)
                {
                    return value;
                } 
                if (totalTicks < 5) {
                  return value;
                }
                else return index % 10 === 0 ? value.slice(0, 5) : '';
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
              fillOpacity={0.4}
              stroke="var(--color-close)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TickerChart;
