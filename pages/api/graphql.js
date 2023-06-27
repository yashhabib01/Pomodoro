import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import typeDefs from "@/graphql/typedef";
import resolvers from "@/graphql/resolvers";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "../../prisma/db.js";

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const session = await getSession(req, res);

    // if the user is not logged in, return null
    if (!session || typeof session === "undefined") {
      throw new GraphQLError("not logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
    // console.log(session);

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: { name: session.user.name, email: session.user.email },
    });

    return {
      user,
    };
  },
});
