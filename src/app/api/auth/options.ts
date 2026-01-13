// app/api/auth/options.ts
import { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import {
  getFreshUser,
  IApiUser,
  IAuthResponse,
  loginUserServer,
  loginUserWithCognitoCode,
} from '@/src/lib/services/auth.server';

interface CustomAuthUser extends NextAuthUser {
  id: string; // Must be present for NextAuth
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  username?: string | null;
  accessToken?: string | null;
  idToken?: string | null;
  refreshToken?: string | null;
  // Include other IApiUser fields if needed directly here, or nest the IApiUser object
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email or Username',
          type: 'text',
          placeholder: 'john@example.com or john_doe',
        },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials): Promise<CustomAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // credentials.email is passed as emailOrUsername to loginUserServer
          const authResponse: IAuthResponse = await loginUserServer(
            credentials.email, // This will be used as 'emailOrUsername'
            credentials.password
          );

          const {
            accessToken,
            user: apiUser,
          } = authResponse;

          if (accessToken  && apiUser && apiUser.id) {
            return {
              id: apiUser.id,
              name: apiUser.name,
              lastName: apiUser.lastName,
              email: apiUser.email,
              username: apiUser.username,
              accessToken: accessToken,
            } as CustomAuthUser;
          } else {
            // If login was technically successful but data is missing
            console.error(
              'Authorize error: Missing tokens or user data from loginUserServer response'
            );

            return null;
          }
        } catch (err) {
          // Log the error and rethrow for NextAuth to handle
          // NextAuth will display The message from err (thrown by loginUserServer)
          console.error('Authorize error:', err);
          if (err instanceof Error) {
            throw new Error(err.message);
          }

          throw new Error('An unknown error occurred during login.');
        }
      },
    }),

    CredentialsProvider({
      id: 'cognito-code-exchange', 
      name: 'Cognito Code Exchange',
      credentials: {
        code: { label: 'Cognito Code', type: 'text' },
      },

      async authorize(credentials): Promise<CustomAuthUser | null> {
        if (!credentials?.code) {
          console.error('Cognito Authorize: No code provided');
          return null;
        }

        try {
          const authResponse: IAuthResponse = await loginUserWithCognitoCode(
            credentials.code
          );
          const {
            accessToken,
            user: apiUser,
          } = authResponse;

          if (accessToken && apiUser && apiUser.id) {
            return {
              id: apiUser.id,
              name: apiUser.name,
              lastName: apiUser.lastName,
              email: apiUser.email,
              username: apiUser.username,
              accessToken: accessToken,
            } as CustomAuthUser;
          }

          return null;
        } catch (err) {
          console.error('Cognito code exchange authorize error:', err);
          if (err instanceof Error) {
            throw new Error(
              err.message || 'Failed to sign in with Cognito code.'
            );
          }

          throw new Error('Unknown error during Cognito code exchange.');
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth',
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // En el inicio de sesión inicial
      if (user) {
        const customUser = user as CustomAuthUser;
        token.accessToken = customUser.accessToken;
        token.idToken = customUser.idToken;
        token.refreshToken = customUser.refreshToken;
        token.userId = customUser.id;
        token.name = customUser.name;
        token.lastName = customUser.lastName;
        token.email = customUser.email;
        token.username = customUser.username;
      }

      // Si el trigger es "update", refrescamos los datos del token
      if (trigger === 'update') {
        try {
          // Llama a la nueva función directamente para obtener datos frescos
          const freshUser: IApiUser = await getFreshUser(
            token.accessToken as string
          );

          // Actualiza el token con los nuevos datos
          token.name = freshUser.name;
          token.lastName = freshUser.lastName;
          // Actualiza cualquier otro campo que pueda cambiar
        } catch (error) {
          console.error('Error refreshing user data in JWT callback:', error);
          // Opcional: puedes añadir lógica para manejar el error, como no actualizar el token
        }
      }

      // On later calls, 'token' is the existing JWT. Return it.
      return token;
    },

    async session({ session, token: jwtToken }) {
      // 'jwtToken' is the JWT object from the jwt callback.
      // We transfer properties from the JWT to the client-side session object.
      if (jwtToken) {
        session.user = {
          ...session.user, // Keep default session user properties (e.g., name, email, image if any)
          id: jwtToken.userId as string, // Use the id from JWT
          name: jwtToken.name as string | null | undefined,
          lastName: jwtToken.lastName as string | null | undefined,
          email: jwtToken.email as string | null | undefined,
          username: jwtToken.username as string | null | undefined,
        };

        session.accessToken = jwtToken.accessToken as string;
        session.idToken = jwtToken.idToken as string;

        // You might not want to expose refreshToken to the client-side session for security reasons.
        // session.refreshToken = jwtToken.refreshToken as string | undefined;
      }

      return session;
    },
  },
};
