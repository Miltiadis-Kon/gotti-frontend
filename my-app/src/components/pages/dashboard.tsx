
import { Separator } from "@radix-ui/react-dropdown-menu"
import { DashboardNotes } from "../ui/dashboard-notes"
import { DashboardAnalytics } from "../ui/dashboard-analytics"
import { PortofolioVisualizerDashboard } from "../ui/portofolio-visualizer-dashboard"

export function DashboardContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <h1 className="text-2xl font-semibold pb-6 ">Overview</h1>
        <DashboardNotes/>
        <Separator className="bg-slate-500 h-px mt-4 -mb-3"/>
        <h1 className="text-2xl font-semibold pb-6 pt-6">Analytics</h1>
        <DashboardAnalytics/>
        <Separator className="bg-slate-500 h-px mt-4 -mb-3"/>
        <h1 className="text-2xl font-semibold pb-6 pt-6">Portofolio</h1>
        <PortofolioVisualizerDashboard/>
    </div>
  )
}
