export const authChecker = ({ context: { req } }: any, roles) => {
  if (req?.session?.userId == null) {
    return false;
  }

  return true;
};
