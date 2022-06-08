import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database";

export default NextAuth({
    providers: [
        Credentials({
            name: 'Custom login',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email@email.xyz' },
                password: { label: 'Password', type: 'password', placeholder: 'xxxxxx' },
            },
            async authorize(credentials) {
                return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],

    pages: {
        signIn: "/auth/login",
        newUser: "/auth/register",
    },

    session: {
        maxAge: 2592000, // 30 days
        strategy: 'jwt',
        updateAge: 86400, // 1 day
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
                switch (account.type) {
                    case 'credentials':
                        token.user = user;
                        break;
                    case 'oauth':
                        token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
                        break;
                }
            }
            return token;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.user = token.user as any;
            return session;
        }
    },
});