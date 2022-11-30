import Redis from "ioredis";
import { isProduction } from "./config";

const redis = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: isProduction ? process.env.REDIS_HOST : "localhost",
});

redis.on("error", function (err) {
  console.error("[Redis error] " + err);
});

export default redis;
