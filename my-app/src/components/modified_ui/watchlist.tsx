
import { Marquee } from "../ui/marquee";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

interface WatchListProps {
    data: any;
    type: "marquee" | "carousel";
    }

export default function WatchList( {data,type}: WatchListProps) {
    if (type === "carousel") {
        return (
            <div className="pt-4 pb-4 ml-4 mr-4">
                <Carousel opts={{ align: "start", loop: true }}>
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
            </div>
        );
    }
    else
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
}
