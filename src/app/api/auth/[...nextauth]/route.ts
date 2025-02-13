import { COOKIES } from "@/utils/constants";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			id: "credentials",
			name: "Credentials",
			credentials: {
				username: {
					label: "Username",
					type: "text",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				return {
					id: credentials?.username ?? "id",
					name: credentials?.username ?? "User name",
					email: "Email@gmail.com",
				};
			},
		}),
		Google({
			clientId: "YOUR_CLIENT_ID",
			clientSecret: "YOUR_CLIENT_SECRET",
		}),
	],

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (user) {
				// Optionally, set a custom cookie here if needed
				setCookie(COOKIES.ACCESSTOKEN, "your_custom_token", {
					maxAge: 30 * 24 * 60 * 60,
				});
				return true;
			}
			return false;
		},
		async jwt({ token, user }) {
			// If it's the first time the token is being created, add the user object to it
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			// Add custom properties to the session object
			// session.user.id = token.id;
			return session;
		},
	},
	secret: "secret",
	pages: {
		// signIn: "/auth/signin", // Custom sign in page
	},
});
export { handler as GET, handler as POST };
