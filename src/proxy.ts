import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/api/inngest(.*)', '/api/uploadthing(.*)', '/job-listings/(.*)', '/ai-search',]);


export default clerkMiddleware(
    async (auth, req) => {
        if (!isPublicRoute(req)) {
            await auth.protect()
        }
    },
    {
        frontendApiProxy: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            enabled: (url) => process.env.NODE_ENV === 'production',
        },
    }
)


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|favicon.ico|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc|__clerk)(.*)',
    ],
}