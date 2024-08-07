import { Separator } from "@/components/ui/separator"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { Card,CardContent,CardFooter,CardHeader,CardTitle } from "../ui/card";
import { DollarSign } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { GoatBadge } from "../ui/badge_tooltipes";

import TickerChrt from "../ui/tickerChart";
import TickerInfo from "../ui/ticker-info";
import { TickerMLRecommendationInfo } from "../ui/ticker-ml-recommendation-info";

export default function EvaluationContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
    {/*TODO VIP FEATURE ONLY */}
    <h1 className="text-2xl font-semibold pb-6 ">Stock Evaluation</h1>
    {/*TODO Add a table with top 5 gainers and losers */}
      <div className="grid gap-1 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent">
        <div className="gap-4">
        <TickerChrt/>
        <TickerMLRecommendationInfo/>
        </div>
      <TickerInfo />
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader className="flex items-center ">
            <CardTitle>Top 5 Gainers & Losers this week</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="grid items-center gap-12 grid-cols-3">
              <div className="flex items-start gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex ">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>AAPL</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 justify-start items-start">
                  <p className="text-sm font-medium leading-none">AAPL</p>
                  <p className="text-xs font-medium leading-none text-muted-foreground ">
                    Apple Inc.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 justify-end items-end">
                <p className="text-sm font-medium">$150.00</p>
                <p className="text-xs font-medium ">+10% PM</p>
              </div>
              <div className="grid gap-1 justify-center items-center ">
                <GoatBadge />
                <GoatBadge />
              </div>
            </div>
            <div className="grid items-center gap-12 grid-cols-3">
              <div className="flex items-start gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex ">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>AMZN</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 justify-start items-start">
                  <p className="text-sm font-medium leading-none">AMZN</p>
                  <p className="text-xs font-medium leading-none text-muted-foreground ">
                    Amazon Inc.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 justify-end items-end">
                <p className="text-sm font-medium">$150.00</p>
                <p className="text-xs font-medium ">+10% PM</p>
              </div>
              <div className="grid gap-1 justify-center items-center ">
                <GoatBadge />
                <GoatBadge />
              </div>
            </div>
            <div className="grid items-center gap-12 grid-cols-3">
              <div className="flex items-start gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex ">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>GOOGL</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 justify-start items-start">
                  <p className="text-sm font-medium leading-none">GOOGL</p>
                  <p className="text-xs font-medium leading-none text-muted-foreground ">
                    Google Inc.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 justify-end items-end">
                <p className="text-sm font-medium">$150.00</p>
                <p className="text-xs font-medium ">+10% PM</p>
              </div>
              <div className="grid gap-1 justify-center items-center ">
                <GoatBadge />
                <GoatBadge />
              </div>
            </div>
            <div className="grid items-center gap-12 grid-cols-3">
              <div className="flex items-start gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex ">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>MSFT</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 justify-start items-start">
                  <p className="text-sm font-medium leading-none">MSFT</p>
                  <p className="text-xs font-medium leading-none text-muted-foreground ">
                    Microsoft Inc.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 justify-end items-end">
                <p className="text-sm font-medium">$1250.00</p>
                <p className="text-xs font-medium ">+10% PM</p>
              </div>
              <div className="grid gap-1 justify-center items-center ">
                <GoatBadge />
                <GoatBadge />
              </div>
            </div>
            <div className="grid items-center gap-12 grid-cols-3">
              <div className="flex items-start gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex ">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>FB</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 justify-start items-start">
                  <p className="text-sm font-medium leading-none">FB</p>
                  <p className="text-xs font-medium leading-none text-muted-foreground ">
                    Facebook Inc.
                  </p>
                </div>
              </div>
              <div className="grid gap-2 justify-end items-end">
                <p className="text-sm font-medium">$1150.00</p>
                <p className="text-xs font-medium ">+10% PM</p>
              </div>
              <div className="grid gap-1 justify-center items-center ">
                <GoatBadge />
                <GoatBadge />
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    
    {/*TODO 
    1) Stock watchlist area
    2) Earnings Calendar
    2) Stock chart area
    3) Stock news area
    4) Stock financials area
    5) Stock analysis area
    6) Stock comparison area
    7) Add to / Remove from portfolio 
           */}
    </div>
  )
}
