import AsyncIf from "@/components/AsyncIf";
import LoadingSwap from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignUpButton } from "@clerk/nextjs";
import JobListingAiSearchForm from "./JobListingAiSearchForm";
import { SparklesIcon } from "lucide-react";



export default function AiSearchPage() {
    return (
        <div className="h-screen flex items-center justify-center p-5">
            <Card className="max-w-4xl p-5">
                <AsyncIf condition={async () => {
                    const { userId } = await getCurrentUser()
                    return userId !== null
                }}
                    otherwise={<NoPermission />}
                    loadingFallback={
                        <LoadingSwap isLoading={true}>
                            <AiCard />
                        </LoadingSwap>
                    }
                >
                    <AiCard />

                </AsyncIf>
            </Card>
        </div>
    )
}

function AiCard() {
    return (
        <>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2"> <SparklesIcon /> Ai Search</CardTitle>
                <CardDescription>This can take a few seconds to process , so please be patient.</CardDescription>
            </CardHeader>
            <CardContent>
                <JobListingAiSearchForm />
            </CardContent>
        </>
    )
}

function NoPermission() {
    return (
        <>
            <CardContent className="text-center" >
                <h2 className="mb-1 font-bold text-xl">Permission Denied</h2>
                <p className="text-muted-foreground">Only Registered User can Use AI Search</p>
                <Button asChild className="mt-4" >
                    <SignUpButton />
                </Button>

            </CardContent>
        </>
    )
}