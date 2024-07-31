import StockCard from "../modified_ui/stock_card";
import Orders from "@/app/orders/page";
import WatchList from "@/components/modified_ui/watchlist";
import { Separator } from "../ui/separator";
import { PortofolioNotes } from "../ui/portofolio-overview";

export function TradesContent() {
  const stockData = [
    {
      symbol: "AAPL",
      ticker: "Apple",
      price: 150.25,
      refCurrency: "USD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      bullish: true,
    },
    {
      symbol: "GOOGL",
      ticker: "Google",
      price: 2500.75,
      refCurrency: "USD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      bullish: false,
    },
    {
      symbol: "MSFT",
      ticker: "Microsoft",
      price: 300.5,
      refCurrency: "USD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.png",
      bullish: true,
    },
    {
      symbol: "AMZN",
      ticker: "Amazon",
      price: 3500.0,
      refCurrency: "USD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      bullish: false,
    },
    {
      symbol: "TSLA",
      ticker: "Tesla",
      price: 750.0,
      refCurrency: "USD",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tesla_Motors_Logo.svg",
      bullish: true,
    },
  ];

  const stockCards = stockData.map((stock, index) => (
    <StockCard
      key={index}
      symbol={stock.symbol}
      ticker={stock.ticker}
      price={stock.price.toString()}
      refCurrency={stock.refCurrency}
      logo={stock.logo}
      bullish={stock.bullish}
    />
  ));

  return (
    <div className="flex min-h-screen w-full flex-col">
      <h1 className="text-2xl font-semibold pb-6 ">Highlights</h1>
      <PortofolioNotes />  {/*TODO 1) Add 2-3 portofolio overview cards (Growth, return risk)*/}
      <Separator className="bg-slate-500 h-px mt-10 mb-1" />
      {/*TODO     2) Add a table with top 5 gainers and losers */}
      {/*TODO    3) Stock Allocation, Asset Allocation, Equity Market Capitalization, Sector diversification  pie chart           */}
      {/*TODO    4) Comparison graphs with S&P 500            */}
      {/*TODO    5) Add a way to change strategy (Growth, Value, Dividend, Index, ETF, Mutual Fund) and recalculate the above data           */}
    </div>
  );
}
