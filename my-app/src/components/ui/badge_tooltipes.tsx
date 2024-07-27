import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function BuyBadge() {
  return (
    <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={"strong_buy"}> &#x1F42E; Buy</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Expected to rise!</p>
          </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}

export function SellBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={"destructive"}>&#x1F43B; Sell</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Expected to fall!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function GoatBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={"secondary"}>&#x1F410; Goat</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>An ideal investment!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function DiamondBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={"outline"}>&#x1F48E; Diamond</Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hold and never sell!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}