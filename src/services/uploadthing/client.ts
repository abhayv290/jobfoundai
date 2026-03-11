import { env } from "@/data/env/server";
import { UTApi } from "uploadthing/server";

export const uploadThing = new UTApi({ token: env.UPLOADTHING_TOKEN })  