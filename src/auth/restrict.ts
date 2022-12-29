import jwt from "jsonwebtoken";

interface ErrorObj {
  status?: number;
  message?: string;
}

const verifyJwtToken = (token, secret): Promise<[Error, any]> =>
  new Promise((resolve) =>
    jwt.verify(token, secret, (err, decoded) => resolve([err, decoded]))
  );

export const authorize = async (req): Promise<ErrorObj | null> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return {
      status: 401,
    };
  }
  const [err, decoded] = await verifyJwtToken(
    token,
    process.env.EXPRESS_SESSION_SECRET as string
  );
  return null;
};

export default async function restrict(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.EXPRESS_SESSION_SECRET as string,
    (err: any, user: any) => {
      console.log(err);

      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;

      next();
    }
  );
}
