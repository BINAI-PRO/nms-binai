import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { getFirebaseAuth } from "@/lib/firebase-admin";
import { upsertUserAndMemberships, type SessionUser } from "@/lib/auth/supabase-users";

type JwtPayload = {
  id?: string;
  image?: string | null;
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
      id: "supabase-password",
      name: "Supabase Email/Password",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Password", type: "password" },
        communityId: { label: "Community", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;
        const communityId =
          credentials?.communityId?.trim() || process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID?.trim() || null;
        if (!email || !password) return null;
        if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;

        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const authRes = await supabase.auth.signInWithPassword({ email, password });
        if (authRes.error || !authRes.data.user) return null;

        const user = authRes.data.user;
        const userName =
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          null;
        const userImage =
          (user.user_metadata?.avatar_url as string | undefined) ??
          (user.user_metadata?.picture as string | undefined) ??
          (user.user_metadata?.avatar as string | undefined) ??
          null;

        const sessionUser = await upsertUserAndMemberships({
          uid: user.id,
          email: user.email ?? email,
          name: userName,
          avatarUrl: userImage,
          communityId,
        });

        return sessionUser;
      },
    }),
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
        const communityId =
          credentials?.communityId?.trim() || process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID?.trim() || null;
        const firebaseAuth = getFirebaseAuth();
        const decoded = await firebaseAuth.verifyIdToken(credentials.idToken);

        const email = credentials.email ?? decoded.email ?? "";
        const sessionUser = await upsertUserAndMemberships({
          uid: decoded.uid,
          email,
          name: decoded.name,
          avatarUrl: typeof decoded.picture === "string" ? decoded.picture : null,
          communityId,
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
        token.image = sessionUser.image ?? null;
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
        image: string | null;
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
        image: typeof jwt.image === "string" ? jwt.image : null,
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
