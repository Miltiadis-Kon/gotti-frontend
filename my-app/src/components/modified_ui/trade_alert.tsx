import { GiPistolGun } from "react-icons/gi";
import { GiChickenOven } from "react-icons/gi";


import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function TradeAlert() {
  return (
    <Alert>
      <GiPistolGun className="h-4 w-4" />
      <AlertTitle>Guns up!</AlertTitle>
      <AlertDescription>
        Gotti purchased 10 shares of AAPL at 150.00$ !
      </AlertDescription>
    </Alert>
  )
}

export function SellAlert() {
  return (
    <Alert>
      <GiChickenOven className="h-4 w-4" />
      <AlertTitle>At ease!</AlertTitle>
      <AlertDescription>
        Gotti sold 10 shares of AAPL at 150.00$ !
      </AlertDescription>
    </Alert>
  )
}