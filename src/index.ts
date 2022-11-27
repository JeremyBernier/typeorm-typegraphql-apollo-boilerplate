import { createServer } from "./server";

const port = process.env.PORT || 4000;
const host = "localhost";

const init = async () => {
  const httpServer = await createServer();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.info(`🚀 Server ready at http://${host}:${port}`);
};

init();
