
import { Marquee } from "@/components/ui/marquee";
import StockCard from "../modified_ui/stock_card";

export default function Trades() {

    const stockData = [
        {
            symbol: "AAPL",
            ticker: "Apple",
            price: 150.25,
            refCurrency: "USD",
            logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
            bullish: true
        },
        {
            symbol: "GOOGL",
            ticker: "Google",
            price: 2500.75,
            refCurrency: "USD",
            logo:"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            bullish: false
        },
        {
            symbol: "MSFT",
            ticker: "Microsoft",
            price: 300.50,
            refCurrency: "USD",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.png",
            bullish: true
        },
        {
            symbol: "AMZN",
            ticker: "Amazon",
            price: 3500.00,
            refCurrency: "USD",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Amazon.com-Logo.svg",
            bullish: true
        },
        {
            symbol: "TSLA",
            ticker: "Tesla",
            price: 750.00,
            refCurrency: "USD",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tesla_Motors_Logo.svg",
            bullish: true
        }
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

    // Add more StockCard components as needed

    return (
        <div>
            <h1 className="text-2xl font-bold">Gotti Favourites</h1>
            <Marquee>
                {stockCards.map((stockCard, index) => (
                    <div
                        key={index}
                        className="relative h-full w-fit mx-[0.1rem] flex items-center justify-start"
                    >
                        {stockCard}
                    </div>
                ))}
            </Marquee>
        </div>
    );
}