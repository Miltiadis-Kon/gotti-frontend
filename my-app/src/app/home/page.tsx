"use client"
import main from  "@/styles/main.module.css"
import StockCard from "@/components/modified_ui/stock_card"
import {PnLChart} from "@/components/modified_ui/pnl_chart"
import {TradeAlert,SellAlert} from "@/components/modified_ui/trade_alert"

import { TickerInfoV2 } from "@/components/modified_ui/ticker_info_v2"

export default function Home() {
  const ticker = "BTC";
  const symbol = "Bitcoin";
  const price = "70.000";
  const refCurrency = "USD";
  const logo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png";
  const bullish = true;
  return (
    <div className={main.div}>
      <StockCard
              symbol={symbol}
              ticker={ticker}
              price={price}
              refCurrency={refCurrency}
              logo={logo}
              bullish={bullish} />
      <PnLChart />
      <TradeAlert />
      <SellAlert />
      <TickerInfoV2
        symbol={symbol}
      />
    </div>
  );
}

