import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Activity, Users, CookingPot, ChefHat, UtensilsCrossed, Skull } from 'lucide-react';


export function PortofolioNotes() {
  return(
<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
<Card x-chunk="dashboard-01-chunk-0">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Return
    </CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">+6.6 %</div>
    <p className="text-xs text-muted-foreground">
      Estimated annual return of investment.
    </p>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-1">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Risk   
    </CardTitle>
  {/*TODO add a pie chart to show profitable trades*/}
  <ChefHat className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">12%</div>
    <p className="text-xs text-muted-foreground">
      Based on standard deviation! You are safe!
    </p>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-2">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
    <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">41.5%</div>
    <p className="text-xs text-muted-foreground">
      Maximum drawdown in the last 3 years.
    </p>
  </CardContent>
</Card>
<Card x-chunk="dashboard-01-chunk-3">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      Diversification
    </CardTitle>
    <Skull className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">70%</div>
    <p className="text-xs text-muted-foreground">
      Your portfolio is well established!
    </p>
  </CardContent>
</Card>
</div>
  );
}

