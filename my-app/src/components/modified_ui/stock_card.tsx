"use-client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiSolidUpArrow  as GreenArrow } from "react-icons/bi";
import { BiSolidDownArrow  as RedArrow} from "react-icons/bi";
import Image from "next/image";

interface StockCardProps {
  ticker: string;
  symbol: string;
  price: string;
  refCurrency: string;
  logo: string;
  bullish: boolean;
}

export default function StockCard( {ticker, symbol, price, refCurrency, logo, bullish}: StockCardProps) {
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Image
                width={20}
                height={20}
                style={{ borderRadius: "50%" }}
                src={logo}
                alt="Apple Inc."
              />
              <p style={{ marginLeft: "5px" }}>{ticker}</p>
            </div>
            <p>{symbol}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
  <div
    style={{
      flexDirection: "row",
      display: "flex",
      alignItems: "baseline",
    }}
  >
    <span style={{ position: 'relative', fontSize: "2rem", marginRight: "2%",marginLeft:"9%" }}>
      {price}
      {bullish ? (
        <GreenArrow
          style={{ color: "green", fontSize: "1.5rem", position: 'absolute', top: 0, left: "-25%" }}
        />
      ) : (
        <RedArrow
          style={{ color: "red", fontSize: "1.5rem", position: 'absolute', top: 0, left: "-25%" }}
        />
      )}
    </span>
    <p style={{ fontSize: "1rem" }}>{refCurrency}</p>
  </div>
</CardContent>
    </Card>
  );
}
