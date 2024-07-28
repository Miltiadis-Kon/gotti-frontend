import main from "@/styles/main.module.css";
import { PnLChart } from "@/components/modified_ui/pnl_chart";

import {
  WeeklyPnLChart,
  MultiPieChart,
  SimpleNoteChart,
  SimpleTickerChart,
  Progress,
} from "../ui/different-charts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function Dashboard() {
  return (
    <div className="w-full mx-auto flex flex-row flex-wrap items-start justify-start">
      <h1 className="w-full font-bold text-3xl sm:text-xl mx-auto flex flex-row flex-wrap items-start justify-start">Dashboard</h1>
      <DashboardTabs/>
      <div className="chart-wrapper mx-auto flex flex-row flex-wrap items-start gap-6 p-6 sm:flex-row sm:p-8 justify-start sm:justify-start">
          <PnLChart />
          <WeeklyPnLChart />
        <div className="grid w-full flex-1 gap-6 justify-start">
          <MultiPieChart />
          <SimpleNoteChart />
        </div>
      </div>
    </div>
  );
}

export function DashboardTabs()
{
  return(
    <Tabs defaultValue="account" className="mx-auto flex flex-row flex-wrap items-start  pt-4 pb-1">
    <TabsList>
      <TabsTrigger value="account">Your Progress</TabsTrigger>
      <TabsTrigger value="global">Global</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="reports">Reports</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      {/*TODO ADD CONTENT HERE*/}
    </TabsContent>
    <TabsContent value="global">
      {/*TODO ADD CONTENT HERE*/}
    </TabsContent>
    <TabsContent value="analytics">
      {/*TODO ADD CONTENT HERE*/}
    </TabsContent>
    <TabsContent value="reports">
      {/*TODO ADD CONTENT HERE*/}
    </TabsContent>
  </Tabs>
  );
}
