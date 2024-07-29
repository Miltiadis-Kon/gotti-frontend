import { Separator } from "@/components/ui/separator"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { Card,CardHeader,CardTitle } from "../ui/card";
import { DollarSign } from "lucide-react";

<AdvancedRealTimeChart theme="dark" autosize></AdvancedRealTimeChart>
export default function EvaluationContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <h1 className="text-2xl font-semibold pb-6 ">Watchlist</h1>
        <Separator className="bg-slate-500 h-px mt-4 mb-3"/>
        <h1 className="text-2xl font-semibold pb-6 ">Advanced Chart</h1>
        <div className="h-96">
        <AdvancedRealTimeChart theme="dark" autosize></AdvancedRealTimeChart>
        </div>
        <Separator className="bg-slate-500 h-px mt-10 mb-1"/>
        <h1 className="text-2xl font-semibold pb-6 ">Portfolio</h1>
    </div>
  )
}
