"use-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiSolidUpArrow as GreenArrow } from "react-icons/bi";
import { BiSolidDownArrow as RedArrow } from "react-icons/bi";
import Image from "next/image";
import { BuyBadge, DiamondBadge } from "../ui/badge_tooltipes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gauge } from "lucide-react";

interface StockCardProps {
  ticker: string;
  symbol: string;
  price: string;
  refCurrency: string;
  logo: string;
  bullish: boolean;
}

export default function StockCard({
  ticker,
  symbol,
  price,
  refCurrency,
  logo,
  bullish,
}: StockCardProps) {
  return (
    <Card className="w-72 h-40">
      <CardHeader className="p-2" >
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
              <Avatar style={{ border: "1px solid black", borderRadius: "50%" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <AvatarImage className="w-full h-full object-fit bg-white" src={logo} />
                </div>
                <AvatarFallback className="bg-white ">{symbol}</AvatarFallback>
              </Avatar>
              <div style={{ display: "flex", justifyContent: "center", flexDirection:"column" }}>
              <p style={{ marginBottom: "5px",marginLeft:"5px" }}>{ticker}</p>
              <p style={{marginLeft:"5px", fontSize:"0.8rem",color:"GrayText" }} >{symbol}</p>
              </div>
            </div>
            <Gauge/>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2" >
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              position: "relative",
              fontSize: "1.5rem",
              marginRight: "2%",
              marginLeft: "9%",
            }}
          >
            {price}
            {bullish ? (
              <GreenArrow
                style={{
                  color: "green",
                  fontSize: "1rem",
                  position: "absolute",
                  top: 0,
                  left: "-25%",
                }}
              />
            ) : (
              <RedArrow
                style={{
                  color: "red",
                  fontSize: "1.5rem",
                  position: "absolute",
                  top: 0,
                  left: "-25%",
                }}
              />
            )}
          </span>
          <p style={{ fontSize: "1rem" }}>{refCurrency}</p>
        </div>
      </CardContent>
      <CardFooter className="p-2" >
        <div
          style={{
            display: "-ms-flexbox",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <BuyBadge />
          <DiamondBadge />
        </div>
      </CardFooter>
    </Card>
  );
}
