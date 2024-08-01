import { Separator } from "../ui/separator";
import { PortofolioNotes} from "../ui/portofolio-overview";
import { PortofolioAllocation,PortfolioPieChart,SectorBarChart,EquityPieChart,AssetAllocationPieChart,ExpectedAnnualReturns } from "../ui/portofolio-allocation";


export function TradesContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <h1 className="text-2xl font-semibold pb-6 ">Highlights</h1>
      <PortofolioNotes />{" "}
      {/*Portofolio overview cards (Growth, return risk)*/}
      <Separator className="bg-slate-500 h-px mt-10 mb-1" />
      {/*Stock Allocation */}
      <div className="grid gap-1 md:gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 bg-transparent">
      <PortofolioAllocation/>
      <PortfolioPieChart />
      </div>
      <ExpectedAnnualReturns/>
      {/*Asset Allocation, Equity Market Capitalization, Sector diversification  pie chart*/}
      <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" >
      <SectorBarChart/>
      <AssetAllocationPieChart/>
      <EquityPieChart/>
      </div>
      {/*TODO Comparison graphs with S&P 500*/}
      <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" >
        </div>
      {/*TODO    5) Add a way to change strategy (Growth, Value, Dividend, Index, ETF, Mutual Fund) and recalculate the above data           */}
    </div>
  );
}

