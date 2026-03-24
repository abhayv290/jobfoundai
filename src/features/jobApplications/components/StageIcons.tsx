import { ApplicationStages } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { CircleCheckIcon, CircleHelpIcon, CircleXIcon, HandshakeIcon, SpeechIcon, StarIcon } from "lucide-react";
import { ReactNode } from "react";


export function StageIcons({ stage }: { stage: ApplicationStages }): ReactNode {
    switch (stage) {
        case "denied":
            return <CircleXIcon />
        case "interested":
            return <CircleCheckIcon />
        case "applied":
            return <CircleHelpIcon />
        case "hired":
            return <HandshakeIcon />
        case "interviewed":
            return <SpeechIcon />
        default:
            throw new Error('Unknown application stage')
    }
}

export function RatingIcons({ rating, className }: { rating: number | null, className?: string }) {
    if (!rating || rating < 1 || rating > 5) {
        return <span className="text-muted-foreground text-sm">Unrated</span>;
    }
    return (
        <div className="flex gap-1 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={cn(className, 'text-xl', rating > i ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
            ))}
        </div>
    )
}