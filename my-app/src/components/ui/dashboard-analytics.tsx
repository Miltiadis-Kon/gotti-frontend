import { Card, CardContent,CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PnLChart } from '@/components/modified_ui/pnl_chart'
import { WeeklyPnLChart } from '@/components/ui/different-charts';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {ArrowUpRight } from 'lucide-react';
import Link  from 'next/link';


export function DashboardAnalytics()
{
    return(
<div className="grid gap-1 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent ">
<Card
  className="xl:col-span-2 bg-transparent  p-0 border-0"
>
  <CardContent className="lg:flex xl:flex  md:flex-col lg:flex-col xl:flex-row  gap-6 items-stretch " >
  <PnLChart/>
  <Separator className="bg-transparent mt-6 mb-6 md:sr-only"/>
  <WeeklyPnLChart/>
  </CardContent>
</Card>
<Separator className="bg-slate-500 h-px mt-4 -mb-3  md:sr-only"/>
<h1 className="text-2xl font-semibold pb-6 pt-6 md:sr-only">Recent Activity</h1>
<Card x-chunk="dashboard-01-chunk-5">
  <CardHeader className="flex justify-between flex-row items-center ">
    <div>
    <CardTitle >
      Recent Positions
    </CardTitle>
    <CardDescription>
      Recent positions from Gotti
      </CardDescription>
      </div>         
       <Button asChild size="sm" className="ml-auto flex gap-1 items-center justify-center ">
      <Link href="#">
        View All
        <ArrowUpRight className="h-4 w-4 " />
      </Link>
    </Button>
  </CardHeader>
  <Separator className="bg-slate-500 h-px mb-4"/>
  <CardContent className="grid gap-8">
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback>AAPL</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          Apple Inc.
        </p>
      </div>
      <div className="ml-auto font-medium">+$1,999.00</div>
    </div>
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback>AMZN</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          Amazon.com Inc.
        </p>
      </div>
      <div className="ml-auto font-medium">-$1,999.00</div>
    </div>
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback>GOOGL</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          Alphabet Inc.
        </p>
      </div>
      <div className="ml-auto font-medium">+$100.00</div>
    </div>
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback>MSFT</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          Microsoft Corporation
        </p>
      </div>
      <div className="ml-auto font-medium">-$199.00</div>
    </div>
  </CardContent>
  <CardFooter>
  </CardFooter>
</Card>
</div>
    );
}