import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, Star } from "lucide-react";
import { GoatBadge } from "./badge_tooltipes";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { TickerInfoTable } from "./ticker-info-table";


export default function TickerInfo() {
    return (
        <div className="xl:col-span-2">
            <div className="flex flex-row items-start mt-4 " >
            <div>
                <h1 className="text-2xl font-bold" >Details</h1>
                <p className=" text-sm font-medium  text-gray-500 pb-4 pt-1" >Apple Inc. is a multinational technology company that designs, manufactures, and sells consumer electronics, computer software, and online services. It is known for its flagship products such as the iPhone, iPad, Mac, and Apple Watch. Apple is one of the world's largest technology companies and has a strong presence in the global market.</p>
            </div>
            <div className="flex items-end gap-4" >
          <Button variant={"outline"} className="gap-2 outline-green-600 outline "  >
            <Check color="green" fill="true" style={{ fontSize: '80%' }}  overflow="visible"  />
            <p className="text-green-600" > Watching!</p>
          </Button>
        </div>
        </div>
        <Card x-chunk="dashboard-01-chunk-4" >
        <CardHeader>
        <div className="flex justify-between items-start gap-4">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://images.branddb.wipo.int/brands/qatm/QA502018000125907/6026C697-th.jpg"  />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">AAPL</h2>
            <p className="text-sm text-gray-500">Apple Inc.</p>
          </div>   
        </div>
        </div>
        </CardHeader>
        <CardContent className="grid gap-4">
            <TickerInfoTable />
        </CardContent>
        </Card>
        </div>
    );
    }

