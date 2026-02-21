import type { CSSProperties } from "react";

export type BrandMode = "tenant" | "community";

export type BrandPalette = {
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
  primary: string;
  primaryAccent: string;
  success: string;
  warning: string;
  danger: string;
  radiusLg: string;
};

export type TenantAssets = {
  logo: string;
  favicon16: string;
  favicon32: string;
  faviconIco: string;
  appleTouchIcon: string;
  manifest: string;
};

export type TenantBranding = {
  id: string;
  companyName: string;
  platformName: string;
  platformDescription: string;
  adminAppName: string;
  adminDescription: string;
  userAppName: string;
  userDescription: string;
  defaultUserBrandMode: BrandMode;
  palette: BrandPalette;
  assets: TenantAssets;
};

type CommunityBrandOverride = {
  name?: string;
  logo?: string;
  palette?: Partial<BrandPalette>;
};

type ParsedCommunityMap = Record<string, CommunityBrandOverride>;

const BISALOM: TenantBranding = {
  id: "bisalom",
  companyName: "Bisalom",
  platformName: "NMS BInAI - Bisalom",
  platformDescription:
    "Sistema operativo integral para comunidades residenciales administradas por Bisalom.",
  adminAppName: "Bisalom Admin",
  adminDescription:
    "Control central de desarrollos, comunidades, proveedores, disponibilidades y reportes.",
  userAppName: "Bisalom Comunidad",
  userDescription:
    "App de residentes con incidencias, reservas, pagos, documentos y accesos QR.",
  defaultUserBrandMode: "community",
  palette: {
    background: "#FFFFFF",
    foreground: "#153B42",
    muted: "#4C7379",
    border: "#D4EAE9",
    card: "#FFFFFF",
    primary: "#1C5C66",
    primaryAccent: "#69C9C7",
    success: "#39A082",
    warning: "#F59E0B",
    danger: "#E11D48",
    radiusLg: "18px",
  },
  assets: {
    logo: "/bisalom/logo.png",
    favicon16: "/bisalom/favicon-16x16.png",
    favicon32: "/bisalom/favicon-32x32.png",
    faviconIco: "/bisalom/favicon.ico",
    appleTouchIcon: "/bisalom/apple-touch-icon.png",
    manifest: "/bisalom/site.webmanifest",
  },
};

const TENANTS: Record<string, TenantBranding> = {
  bisalom: BISALOM,
};

function parseBrandMode(rawValue: string | undefined, fallback: BrandMode): BrandMode {
  if (rawValue === "tenant" || rawValue === "community") return rawValue;
  return fallback;
}

function parseCommunityOverrides(rawJson: string | undefined): ParsedCommunityMap {
  if (!rawJson) return {};
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const result: ParsedCommunityMap = {};
    for (const [communityId, override] of Object.entries(parsed)) {
      if (!override || typeof override !== "object" || Array.isArray(override)) continue;
      const typedOverride = override as CommunityBrandOverride;
      result[communityId] = {
        name: typeof typedOverride.name === "string" ? typedOverride.name : undefined,
        logo: typeof typedOverride.logo === "string" ? typedOverride.logo : undefined,
        palette:
          typedOverride.palette && typeof typedOverride.palette === "object"
            ? typedOverride.palette
            : undefined,
      };
    }
    return result;
  } catch {
    return {};
  }
}

export function getActiveTenantId(): string {
  return (process.env.NEXT_PUBLIC_TENANT_ID ?? "bisalom").trim().toLowerCase() || "bisalom";
}

export function getActiveTenantBranding(): TenantBranding {
  const tenant = TENANTS[getActiveTenantId()] ?? BISALOM;
  const mode = parseBrandMode(process.env.NEXT_PUBLIC_USER_BRANDING_MODE, tenant.defaultUserBrandMode);
  return {
    ...tenant,
    defaultUserBrandMode: mode,
  };
}

export type EffectiveUserBranding = {
  tenantId: string;
  mode: BrandMode;
  communityId?: string;
  displayName: string;
  logo: string;
  palette: BrandPalette;
};

export function getEffectiveUserBranding(communityId?: string): EffectiveUserBranding {
  const tenant = getActiveTenantBranding();
  const configuredCommunityId = communityId?.trim() || process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY_ID?.trim();
  const mode = tenant.defaultUserBrandMode;
  if (mode !== "community" || !configuredCommunityId) {
    return {
      tenantId: tenant.id,
      mode,
      displayName: tenant.userAppName,
      logo: tenant.assets.logo,
      palette: tenant.palette,
    };
  }

  const overrides = parseCommunityOverrides(process.env.NEXT_PUBLIC_COMMUNITY_BRANDING_JSON);
  const communityOverride = overrides[configuredCommunityId];
  if (!communityOverride) {
    return {
      tenantId: tenant.id,
      mode,
      communityId: configuredCommunityId,
      displayName: tenant.userAppName,
      logo: tenant.assets.logo,
      palette: tenant.palette,
    };
  }

  return {
    tenantId: tenant.id,
    mode,
    communityId: configuredCommunityId,
    displayName: communityOverride.name ?? tenant.userAppName,
    logo: communityOverride.logo ?? tenant.assets.logo,
    palette: {
      ...tenant.palette,
      ...(communityOverride.palette ?? {}),
    },
  };
}

export function paletteToCssVariables(palette: BrandPalette): CSSProperties {
  return {
    "--background": palette.background,
    "--foreground": palette.foreground,
    "--muted": palette.muted,
    "--border": palette.border,
    "--card": palette.card,
    "--primary": palette.primary,
    "--primary-accent": palette.primaryAccent,
    "--success": palette.success,
    "--warning": palette.warning,
    "--danger": palette.danger,
    "--radius-lg": palette.radiusLg,
  } as CSSProperties;
}
