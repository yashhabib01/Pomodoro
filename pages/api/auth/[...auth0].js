import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import prisma from "@/prisma/db";
const afterCallback = async (req, res, session, state) => {
  try {
    const user = session.user;
    if (user) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { name: user.nickname, email: user.email },
      });
    }
  } catch (error) {
    console.log(error);
  }

  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.messsage);
    }
  },
});
