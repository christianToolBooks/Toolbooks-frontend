import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      lastName: string | null | undefined;
      username: string | null | undefined;
      role: string | null | undefined;
      isBusinessProfile: boolean;
    } & DefaultSession["user"];

    accessToken: string;
    idToken: string;
  }
}
