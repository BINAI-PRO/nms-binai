import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

function authConfig() {
  return {
    enabled: process.env.LOCAL_AUTH_ENABLED !== "false",
    adminUser: process.env.LOCAL_ADMIN_USER ?? "admin",
    adminPass: process.env.LOCAL_ADMIN_PASS ?? "admin123",
    residentUser: process.env.LOCAL_RESIDENT_USER ?? "residente",
    residentPass: process.env.LOCAL_RESIDENT_PASS ?? "residente123",
  };
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Credenciales invalidas" }, { status: 400 });
  }

  const config = authConfig();
  if (!config.enabled) {
    return NextResponse.json({ error: "Login local deshabilitado" }, { status: 403 });
  }

  const username = parsed.data.username.trim();
  const password = parsed.data.password;

  let role: "admin" | "resident" | null = null;
  let redirectPath = "/sign-in";

  if (username === config.adminUser && password === config.adminPass) {
    role = "admin";
    redirectPath = "/admin/dashboard";
  } else if (username === config.residentUser && password === config.residentPass) {
    role = "resident";
    redirectPath = "/app/home";
  }

  if (!role) {
    return NextResponse.json({ error: "Usuario o password incorrecto" }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    role,
    redirectPath,
  });

  const secure = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 12;

  response.cookies.set("binai_session", "1", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  response.cookies.set("binai_role", role, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  response.cookies.set("binai_user", username, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
}
