import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {TooltipProvider} from "@/components/ui/tooltip";

import { BuyBadge,SellBadge,GoatBadge } from "@/components/ui/badge_tooltipes";

import { LiaHandshake } from "react-icons/lia";

import TradingViewWidget from "@/components/modified_ui/mini_chart";

interface TickerInfoProps {
    symbol: string;
    logo: string;
    name: string;
  }

export function TickerInfo({ symbol,logo,name }: TickerInfoProps) {
  const price = "70000$";
  const change = "+5.4%";

  return (
    <Card>
      <CardHeader style={{ padding: "0.5rem", marginTop: "0.5rem" }}>
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
              <img
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={logo}
                alt={name}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  marginLeft: "0.5rem",
                }}
              >
                <p style={{ fontSize: "1.2rem" }}>{symbol}</p>
                <p style={{ marginTop: "0.5rem" }}>{name}</p>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "grey",
          margin: "1rem 0",
        }}
      ></div>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "flex-start",
              marginRight: "5rem",
            }}
          >
            <span style={{ fontSize: "1.7rem" }}>{price}</span>
            <span style={{ fontSize: "1.2rem", color: "green" }}>{change}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <TooltipProvider>
                <GoatBadge/>
            </TooltipProvider>
          </div>
        </div>
        <div
        style={{
          width: "100%",
          height: "0px",
          backgroundColor: "grey",
          margin: "1rem 0",
        }}
      ></div>
        <TradingViewWidget symbol={symbol} />
        <p style={{fontSize:"0.8rem", color:"grey",textAlign:"center",marginTop:"0.2rem" }} >Daily {name} Chart </p>
      </CardContent>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "grey",
          margin: "1rem 0",
        }}
      ></div>
      <CardFooter>
        <LiaHandshake style={{marginRight:"0.2rem"}} />
        <p style={{ fontSize: "0.8rem", color: "grey", textAlign:"center" }}> Gotti has still high hopes for this one! </p>
      </CardFooter>
    </Card>
  );
}
