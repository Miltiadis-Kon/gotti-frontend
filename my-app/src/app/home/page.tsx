"use client"
import main from  "@/styles/main.module.css"
import StockCard from "@/components/modified_ui/stock_card"
import {PnLChart} from "@/components/modified_ui/pnl_chart"
import {TradeAlert,SellAlert} from "@/components/modified_ui/trade_alert"

import { TickerInfoV2 } from "@/components/modified_ui/ticker_info_v2"

export default function Home() {
  return (
    
    <div className={main.div}>
      <StockCard />
      <PnLChart />
      <TradeAlert />
      <SellAlert />
      <TickerInfoV2  symbol="BTCUSD"/>
    </div>
  )
}

