import { AuthOptions } from "next-auth";
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import dbConnect from "@utils/database";
import UserModel from "@models/user";
import NextAuth from "next-auth/next";
import { Profile } from "next-auth";
import toast from "react-hot-toast";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      github_username?: string;
    };
  }
}
interface CustomProfile extends Profile {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

export const options: AuthOptions = {
  providers: [
    GitHubProvider({
      name: "Github",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          userName: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await UserModel.findOne({
        email: session?.user?.email,
      });
      session.user.github_username = sessionUser?.login;
      // console.log(session);
      return session;
    },
    async signIn(params) {
      const { user, account, profile, credentials } = params;
      // console.log(profile);
      const customProfile = profile as CustomProfile;
      const { login, name, avatar_url, email } = customProfile || {};

      console.log("Login:", login);
      console.log("Avatar URL:", avatar_url);
      console.log("Name of user : ", name);

      dbConnect();
      toast.success("Sign-in successful!");

      const findUser = await UserModel.findOne({ login: login });
      if (findUser) {
        return true;
      }
      await UserModel.create({
        login: login,
        name: name ? name : login,
        avatar_url: avatar_url,
        email: email,
      });
      return true;
    },
  },
};

const handler = NextAuth(options);
export default handler;
