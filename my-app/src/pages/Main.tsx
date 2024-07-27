import main from  "@/styles/main.module.css"
import StockCard from "@/components/modified_ui/stock_card"
import {PnLChart} from "@/components/modified_ui/pnl_chart"
import {TradeAlert,SellAlert} from "@/components/modified_ui/trade_alert"
import {TickerInfo} from "@/components/modified_ui/ticker_info"

import { TickerInfoV2 } from "@/components/modified_ui/ticker_info_v2"

export default function Main() {
  return (
    <div className={main.div}>
      <StockCard />
      <PnLChart />
      <TradeAlert />
      <SellAlert />
      <TickerInfo  symbol="BTCUSD" logo="https://cryptologos.cc/logos/bitcoin-btc-logo.png" name="Bitcoin" />
      <TickerInfoV2  symbol="BTCUSD"/>
    </div>
  )
}

