import { env } from "@/data/env/server";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from "postgres";
import * as schema from './schema'


const client = postgres(env.DATABASE_URL, {
    onnotice: (msg) => console.log(msg)
});

export const db = (() => {
    try {
        return drizzle(client, { schema })
    } catch (err) {
        console.error('Failed to initialize Drizzle', err)
        throw err
    }
})()


