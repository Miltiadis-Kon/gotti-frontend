
import main from  "@/styles/main.module.css"
import {PnLChart} from "@/components/modified_ui/pnl_chart"

export default function Dashboard() {
  return (
    
    <div className={main.div}>
      <PnLChart />
    </div>
  )
}

