import { Button } from "@/components/ui/button"
import main from  "@/styles/main.module.css"
import StockCard from "@/components/modified_ui/stock_card"

export default function Main() {
  return (
    <div className={main.div}>
      <StockCard />
      <Button>Click me</Button>
      <Button variant={"secondary"}>Click me</Button>
      <Button variant={"ghost"} >Click me</Button>
    </div>
  )
}

