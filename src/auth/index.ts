import redis from "../redis";

// req.session is set in login resolver

export const loginUser = async (req, user) => {
  const session = req?.session;
  console.log("loginUser session", req?.session);
  if (user?.id == null || session == null) {
    console.error("loginUser fail ", req?.session, user);
    throw new Error(
      `Cannot log in user. Either userId (${user?.id}) is null, or session is null, or req is null`
    );
  }

  const { id: userId, role } = user;

  session.userId = userId;

  if (role != null) {
    session.role = role;
  }
  if (req.sessionID) {
    return redis.lpush(`session:${userId}`, req.sessionID);
  }
  return Promise.resolve();
};

// todo: use SuperAdmin enum
export function isUserMod(role: number): boolean {
  return role === 1;
}
