import { Check, Send, Clock, UserCheck, Trophy, XCircle, SpeechIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApplicationStatus } from '@/app/(job-seeker)/application-status/[jobId]/page';

const JobProgressBar = ({ status, appliedAt, updatedAt }: { status: ApplicationStatus, appliedAt: string, updatedAt: string }) => {

    const stages = [
        { label: 'Applied', icon: Check, color: 'text-blue-600', bg: 'bg-blue-600', active: true, date: appliedAt },
        { label: 'Sent', icon: Send, color: 'text-blue-600', bg: 'bg-blue-600', active: true, date: appliedAt },
    ];


    //intermediate/final stages based on status
    if (status === 'interested' || status === 'interviewed' || status === 'hired' || status === 'denied') {
        if (status !== 'interested') {
            stages.push({ label: 'Interested', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-600', active: true, date: updatedAt });
        }
    }


    // 3. Handle the Current/Final State
    const getStatusConfig = () => {
        switch (status) {
            case 'interested':
                return { label: 'Shortlisted', icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-600', active: true };
            case 'interviewed':
                return { label: 'Interviewing', icon: SpeechIcon, color: 'text-purple-500', bg: 'bg-purple-500', active: true };
            case 'hired':
                return { label: 'Hired!', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500', active: true };
            case 'denied':
                return { label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500', active: true };
            default:
                return null;
        }
    };

    const currentStatus = getStatusConfig();
    if (currentStatus) {
        // Add the current active status 
        if (!stages.find(s => s.label === currentStatus.label)) {
            stages.push({ ...currentStatus, date: updatedAt });
        }
    }

    // Add "Awaiting" only if not hired or denied
    const isTerminal = status === 'hired' || status === 'denied';
    if (!isTerminal) {
        stages.push({
            label: 'Awaiting Recruiter Action',
            icon: Clock,
            color: 'text-zinc-400',
            bg: 'bg-zinc-200 dark:bg-zinc-800',
            active: false,
            date: ''
        });
    }

    // Progress width is now (active_nodes - 1) / (total_nodes - 1)
    const activeCount = stages.filter(s => s.active).length;
    const progressPercentage = isTerminal
        ? 100
        : ((activeCount - 1) / (stages.length - 1)) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
            <div className="relative">
                {/* Background Track */}
                <div className="absolute top-3 left-0 w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full" />

                {/* Active Progress Filling */}
                <div
                    className="absolute top-3 left-0 h-2 bg-blue-600 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                />

                <div className="relative flex justify-between">
                    {stages.map((stage, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {/* Node Circle */}
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 transition-all  duration-500",
                                stage.active
                                    ? `${stage.bg} border-white dark:border-zinc-950 text-white shadow-md`
                                    : "bg-white dark:bg-zinc-950 border-zinc-200 text-zinc-400"
                            )}>
                                <stage.icon size={15} className={cn(!stage.active && "opacity-50")} />
                            </div>

                            {/* Labels */}
                            <div className="mt-3 flex flex-col items-center text-center min-w-20">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-tighter",
                                    stage.active ? "text-zinc-200" : "text-zinc-400"
                                )}>
                                    {stage.label}
                                </span>
                                {stage.date && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {stage.date}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobProgressBar;