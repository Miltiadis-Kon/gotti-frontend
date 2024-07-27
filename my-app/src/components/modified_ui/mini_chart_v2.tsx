import { MiniChart } from "react-ts-tradingview-widgets";

interface  MiniChartProps {
    symbol: string;
}


export default function MiniChartV2( {symbol}: MiniChartProps) {
    return (
        <MiniChart colorTheme="dark" width="100%" height="300px"
        symbol={symbol} locale="en" dateRange="3M" autosize={true}
        chartOnly={false}
        isTransparent={true}
        ></MiniChart>
    )
    }

