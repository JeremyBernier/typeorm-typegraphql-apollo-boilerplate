import { CorsOptions } from "cors";

export const isProduction = process.env.NODE_ENV === "production";

export const corsOptions: CorsOptions = {
  credentials: true,
  // origin: process.env.CORS_ORIGIN || `http://localhost:${CLIENT_PORT}`,
  origin: `http://localhost:3000`,
  // // origin: "http://localhost:3000",
  // origin: (
  //   requestOrigin: string | undefined,
  //   callback: (err: Error | null, allow?: boolean) => void
  // ): void => {
  //   if (!requestOrigin || matchUrl(requestOrigin, whitelist)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error(`${requestOrigin} Not allowed by CORS`));
  //   }
  // },
};
