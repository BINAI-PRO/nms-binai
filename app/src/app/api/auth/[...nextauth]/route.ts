import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { getFirebaseAuth } from "@/lib/firebase-admin";
import { upsertUserAndMemberships, type SessionUser } from "@/lib/auth/supabase-users";

type JwtPayload = {
  id?: string;
  role?: string;
  community_ids?: string[];
  active_community_id?: string | null;
  unit_id_optional?: string | null;
  building_id_optional?: string | null;
} & Record<string, unknown>;

const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      id: "firebase-bridge",
      name: "Firebase Bridge",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
        email: { label: "Correo", type: "text" },
        communityId: { label: "Community", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;
        const firebaseAuth = getFirebaseAuth();
        const decoded = await firebaseAuth.verifyIdToken(credentials.idToken);

        const email = credentials.email ?? decoded.email ?? "";
        const sessionUser = await upsertUserAndMemberships({
          uid: decoded.uid,
          email,
          name: decoded.name,
          communityId: credentials.communityId ?? null,
        });
        return sessionUser;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const sessionUser = user as SessionUser;
        token.id = sessionUser.id;
        token.role = sessionUser.role;
        token.community_ids = sessionUser.community_ids;
        token.active_community_id = sessionUser.active_community_id;
        token.unit_id_optional = sessionUser.unit_id_optional;
        token.building_id_optional = sessionUser.building_id_optional;
      }
      return token;
    },
    async session({ session, token }) {
      const jwt = token as JwtPayload;
      type AugmentedSessionUser = {
        id: string;
        email: string;
        name: string;
        role: string;
        community_ids: string[];
        active_community_id: string | null;
        unit_id_optional: string | null;
        building_id_optional: string | null;
      };
      session.user = {
        id: jwt.id ?? "",
        email: session.user?.email ?? "",
        name: session.user?.name ?? "",
        role: jwt.role ?? "resident",
        community_ids: jwt.community_ids ?? [],
        active_community_id: jwt.active_community_id ?? null,
        unit_id_optional: jwt.unit_id_optional ?? null,
        building_id_optional: jwt.building_id_optional ?? null,
      } as AugmentedSessionUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
