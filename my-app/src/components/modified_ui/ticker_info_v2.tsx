import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  import {TooltipProvider} from "@/components/ui/tooltip";
  
  import { BuyBadge,SellBadge,GoatBadge, DiamondBadge } from "@/components/ui/badge_tooltipes";
  
  import { LiaHandshake } from "react-icons/lia";
  
  import MiniChartV2 from "./mini_chart_v2";
  
  interface TickerInfoProps {
      symbol: string;
    }
  
  export function TickerInfoV2({ symbol }: TickerInfoProps) {
    return (
      <Card>
        <CardHeader>
          <MiniChartV2 symbol={symbol} />
          <div style={{ display: "flex", justifyContent:"space-around", flexDirection:"row", alignItems:"flex-end", margin:"0 0.5rem" }}>
          <TooltipProvider>
                  <GoatBadge/>
              </TooltipProvider>
              <TooltipProvider>
                  <DiamondBadge/>
              </TooltipProvider>
              <TooltipProvider>
                  <BuyBadge/>
              </TooltipProvider>
              </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "grey",
            margin: "1rem 0",
          }}
        ></div>
        </CardHeader>
        <CardFooter>
          <LiaHandshake style={{marginRight:"0.2rem"}} />
          <p style={{ fontSize: "0.8rem", color: "grey", textAlign:"center" }}> Gotti has still high hopes for this one! </p>
        </CardFooter>
      </Card>
    );
  }
  