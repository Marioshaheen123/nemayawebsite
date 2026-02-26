import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Node.js modules).
 * Used by middleware for session checking only.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [], // Providers added in full auth.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (pathname === "/admin/login") {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }

      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        return isLoggedIn;
      }

      return true;
    },
  },
  session: { strategy: "jwt" },
};
