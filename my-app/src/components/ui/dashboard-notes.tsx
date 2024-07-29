import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Activity, Users, CookingPot, ChefHat, UtensilsCrossed } from 'lucide-react';


export function DashboardNotes() {
  return(
<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
<Card x-chunk="dashboard-01-chunk-0">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Account Balance / Goal
    </CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89 / $50,000.00</div>
    <p className="text-xs text-muted-foreground">
      +5% to your goal this month!
    </p>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-1">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Profitable Trades
    </CardTitle>
  {/*TODO add a pie chart to show profitable trades*/}
  <ChefHat className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">67%</div>
    <p className="text-xs text-muted-foreground">
      Gotti is cooking this week!<br/>34/50 trades were profitable!
    </p>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-2">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Account Growth</CardTitle>
    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">+ $10,000.00</div>
    <p className="text-xs text-muted-foreground">
      Made from thin air! You can buy a car with that!
    </p>
  </CardContent>
</Card>
</div>
  );
}