import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis/redis";

export async function middleware(request: NextRequest) {
  if (request.url.includes("/api")) {
    const ip = request.ip;
    console.log(
      `\u001b[32m[${request.method}] \u001b[0m${request.url} coming from IP ${ip}`
    );

    if (ip) {
      const client = await redis.getClient();
      const connections = await client.get(ip);
      if (connections) {
        const limit =
          (process.env.REQUEST_LIMIT && parseInt(process.env.REQUEST_LIMIT)) ||
          50;
        if (parseInt(connections) > limit) {
          return new NextResponse(
            JSON.stringify({
              message: "Rate limit exceeded. Please try again in a minute.",
            }),
            { status: 429, headers: { "content-type": "application/json" } }
          );
        }
        await client.set(ip, parseInt(connections) + 1);
      } else {
        await client.setEx(ip, 60, "1");
      }
    }
  }
}
