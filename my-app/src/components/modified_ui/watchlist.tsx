
import { Marquee } from "../ui/marquee";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface WatchListProps {
    data: any;
    type: "marquee" | "carousel"|"none";
    }

export default function WatchList( {data,type}: WatchListProps) {
    if (type === "carousel") {
        return (
            <AspectRatio ratio={16 / 9}>
                <Carousel opts={{ align: "start", loop: true }} className="rounded-md object-cover"  >
                    <CarouselContent>
                        {data.map((item: any, index: number) => (
                            <CarouselItem key={index} className="basis-1/3 md-1/2 pl-1">
                                {item}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </AspectRatio>
        );
    }
    else if (type === "marquee")
    {
        return (
            <div className="pt-4 pb-4">
                <Marquee>
                    {data.map((item: any, index: number) => (
                        <div key={index} className="pr-4">
                            {item}
                        </div>
                    ))}
                </Marquee>
            </div>
        );
    }
    else
    {
        return (
            <div className="overflow-hidden flex flex-row" >
                {data.map((item: any, index: number) => (
                    <div key={index} className="pr-4">
                        {item}
                    </div>
                ))}
            </div>
        );
    }
}
