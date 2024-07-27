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

export default function StockCard() {
  const ticker = "BTC";
  const symbol = "Bitcoin";
  const price = "70.000";
  const refCurrency = "USD";
  const logo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png";
  const bullish = true;
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
                style={{ width: "20px", height: "20px", borderRadius: "50%" }}
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
