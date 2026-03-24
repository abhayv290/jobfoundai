import { Badge } from '@/components/ui/badge';
import { RatingIcons } from './StageIcons';

export const ResumeFitSection = ({ rating }: { rating: number }) => {
    // Simple mapping for labels and colors
    const RATING_CONFIG: Record<number, {
        label: string;
        description: string;
        color: string
    }> = {
        5: {
            label: "Exceptional Match",
            description: "Your profile is an exceptional match. Your skills and professional experience align perfectly with the core requirements of this role.",

            color: "bg-emerald-600 dark:bg-emerald-400"
        },
        4: {
            label: "Strong Match",
            description: "You are a strong candidate. You possess most of the key qualifications and the relevant background requested by the recruiter.",

            color: "bg-blue-600 dark:bg-blue-400"
        },
        3: {
            label: "Good Potential",
            description: "You have a solid foundation for this role, though some specific secondary skills or niche experiences might need further emphasis.",

            color: "bg-amber-600 dark:bg-amber-400"
        },
        2: {
            label: "Gap Identified",
            description: "There is some alignment, but significant gaps in required skills or years of experience were identified for this specific position.",

            color: "bg-zinc-600"
        },
        1: {
            label: "Low Alignment",
            description: "Your current profile has low alignment with this role. Consider tailoring your resume to better highlight transferable skills.",
            color: "bg-rose-600 dark:bg-slate-700"
        },
    }

    const { label, color, description } = RATING_CONFIG[rating as keyof typeof RATING_CONFIG] || RATING_CONFIG[1];

    return (
        <div className="mt-6 p-5  rounded-2xl ">
            <div className="flex flex-col gap-4">
                {/* Header Area */}
                <div className="flex items-center gap-4">
                    <h3 className="font-bold ">Resume Analysis</h3>
                    <Badge className={`tracking-tight text-accent-foreground font-semibold ${color}`}>
                        {label}
                    </Badge>
                </div>
                {/* Rating and Simple Progress */}
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <RatingIcons rating={rating} />
                        <Badge className=" bg-accent text-accent-foreground font-medium ">{rating} / 5</Badge>
                    </div>
                </div>

                {/* Placeholder for future Markdown text */}
                <p className="text-sm text-accent-foreground  leading-relaxed italic">
                    {description}
                </p>
            </div>
        </div>
    );
};