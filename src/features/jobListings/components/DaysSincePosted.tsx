import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { connection } from 'next/server';
import { Badge } from '../../../components/ui/badge';


export default async function DaysSincePosted({ postedAt }: {
    postedAt: Date
}) {
    await connection();
    const daysSincePosted = formatDistanceToNow(postedAt, { addSuffix: true })
    const daySince = differenceInDays(postedAt, new Date());
    if (!daySince) {
        return <Badge>New</Badge>
    }
    return <Badge variant={'outline'}>{daysSincePosted}</Badge>
}
