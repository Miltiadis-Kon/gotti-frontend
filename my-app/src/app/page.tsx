"use client"
import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Gauge,
  Search,
  HandPlatter,
  UserRound,
  Landmark,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"


import { useState } from "react";
import { useRouter } from "next/navigation";

import {DashboardContent}  from "@/components/pages/dashboard"
import { default as TradesContent } from "@/components/pages/trades"
import EvaluationContent from "@/components/pages/evaluation"
import {AddFundsContent} from "@/components/pages/addFunds"
import {ProfileContent} from "@/components/pages/profile"


export default function Dashboard() {

  //render content based on view state
  const [view, setView] = useState("dashboard");
  const router = useRouter();

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <DashboardContent />;
      case "trades":
        return <TradesContent />;
      case "evaluation":
        return <EvaluationContent />;
      case "addFunds":
        return <AddFundsContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  // render navigation link class (highlighted or not) based on active link state
  const [activeLink, setActiveLink] = useState("dashboard");

  const handleLinkClick = (view: string) => {
    setActiveLink(view);
  };

  const getLinkClass = (view: string) => {
    return activeLink === view
      ? "flex items-center gap-3 rounded-lg px-3 py-2 bg-muted text-muted-foreground transition-all hover:text-primary text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };

  const getLinkClassMobile = (view: string) => {
    return activeLink === view
      ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
      :"mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground";
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={()=>{ setView("dashboard"); handleLinkClick("dashboard");}} >
              <Image src="/icons/face.ico" alt="Gotti" width={30} height={30} />
              <span className="">Gotti</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className={getLinkClass("dashboard")}
                onClick={() => {setView("dashboard");handleLinkClick("dashboard");}
                }
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className={getLinkClass("trades")}
                onClick={() => {setView("trades"); handleLinkClick("trades");}}
              >
                <HandPlatter className="h-4 w-4" />
                Trades
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <Link
                href="#"
                className={getLinkClass("evaluation")}
                onClick={() => {setView("evaluation"); handleLinkClick("evaluation");}}
              >
                <Gauge className="h-4 w-4" />
                Evaluation
              </Link>
              <Link
                href="#"
                className={getLinkClass("addFunds")}
                onClick={() => {setView("addFunds"); handleLinkClick("addFunds"); }}
              >
                <Landmark className="h-4 w-4" />
                Add Funds
              </Link>
              <Link
                href="#"
                className={getLinkClass("profile")}
                onClick={() => {setView("profile"); handleLinkClick("profile");} }
              >
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Link href="/pricing">
                  <Button size="sm" className="w-full">
                    Upgrade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                  onClick={()=>{ setView("dashboard"); handleLinkClick("dashboard");}}
                >
              <Image src="/icons/face.ico" alt="Gotti" width={30} height={30} />
              <span className="">Gotti</span>
                </Link>
                <SheetClose asChild>
                <Link
                  href="#"
                  className={getLinkClassMobile("dashboard")}
                  onClick={() => {setView("dashboard"); handleLinkClick("dashboard");}// Close the Sheet
                }
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link
                  href="#"
                  className={getLinkClassMobile("trades")}
                  onClick={() => {setView("trades"); handleLinkClick("trades");  }}
                >
                  <HandPlatter className="h-5 w-5" />
                  Trades
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link
                  href="#"
                  className={getLinkClassMobile("evaluation")}
                  onClick={() => {setView("evaluation"); handleLinkClick("evaluation");}}
                  >
                  <Gauge className="h-5 w-5" />
                  Evaluation
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link
                  href="#"
                  className={getLinkClassMobile("addFunds")}
                  onClick={() => {setView("addFunds"); handleLinkClick("addFunds"); }}
                >
                  <Landmark className="h-5 w-5" />
                  Add Funds
                </Link>
                </SheetClose>
                <SheetClose asChild>
                <Link
                href="#"
                className={getLinkClassMobile("profile")}
                onClick={() => {setView("profile"); handleLinkClick("profile");} }
                >
                  <UserRound className="h-5 w-5" />
                  Profile
                </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            {/*TODO: ADD main evaluation page */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
