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
  assets?: Partial<TenantAssets>;
  palette?: Partial<BrandPalette>;
};

type ParsedCommunityMap = Record<string, CommunityBrandOverride>;

const BISALOM: TenantBranding = {
  id: "bisalom",
  companyName: "Bisalom",
  platformName: "NMS BInAI - Comunidades",
  platformDescription:
    "Sistema operativo integral para comunidades residenciales.",
  adminAppName: "Bisalom Admin",
  adminDescription:
    "Control central de desarrollos, comunidades, proveedores, disponibilidades y reportes.",
  userAppName: "Comunidad Residencial",
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

const DEFAULT_COMMUNITY_OVERRIDES: ParsedCommunityMap = {
  "f7fd88d8-64bd-4fa1-b5a0-bf96038fef62": {
    name: "Bisalom Hub",
    logo: "/bisalom/logo.png",
  },
  "7c5c828c-f95a-4c31-a5c7-1b338df82001": {
    name: "Residencial Encino",
    logo: "/encino/logo.webp",
    assets: {
      logo: "/encino/logo.webp",
      favicon16: "/encino/favicon-16x16.png",
      favicon32: "/encino/favicon-32x32.png",
      faviconIco: "/encino/favicon.ico",
      appleTouchIcon: "/encino/apple-touch-icon.png",
      manifest: "/encino/site.webmanifest",
    },
    palette: {
      background: "#F4F8F5",
      foreground: "#1B2A1F",
      muted: "#5F6E66",
      border: "#D7E5DB",
      card: "#FFFFFF",
      primary: "#1E5A3A",
      primaryAccent: "#A6D4B8",
      success: "#2A9D62",
      warning: "#D08A1F",
      danger: "#CE4257",
      radiusLg: "18px",
    },
  },
  "7c5c828c-f95a-4c31-a5c7-1b338df82002": {
    name: "Valle La Silla",
    palette: {
      background: "#F6F7FB",
      foreground: "#20263A",
      muted: "#667188",
      border: "#DEE5F2",
      card: "#FFFFFF",
      primary: "#2B4A7F",
      primaryAccent: "#8FB3F2",
      success: "#2F9E8A",
      warning: "#D8A24B",
      danger: "#D1495B",
      radiusLg: "18px",
    },
  },
};

function mergeCommunityOverrides(
  base: ParsedCommunityMap,
  custom: ParsedCommunityMap
): ParsedCommunityMap {
  const merged: ParsedCommunityMap = { ...base };
  for (const [communityId, override] of Object.entries(custom)) {
    const current = merged[communityId];
    merged[communityId] = {
      ...(current ?? {}),
      ...override,
      assets: {
        ...(current?.assets ?? {}),
        ...(override.assets ?? {}),
      },
      palette: {
        ...(current?.palette ?? {}),
        ...(override.palette ?? {}),
      },
    };
  }
  return merged;
}

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
        assets:
          typedOverride.assets && typeof typedOverride.assets === "object"
            ? {
                logo:
                  typeof typedOverride.assets.logo === "string"
                    ? typedOverride.assets.logo
                    : undefined,
                favicon16:
                  typeof typedOverride.assets.favicon16 === "string"
                    ? typedOverride.assets.favicon16
                    : undefined,
                favicon32:
                  typeof typedOverride.assets.favicon32 === "string"
                    ? typedOverride.assets.favicon32
                    : undefined,
                faviconIco:
                  typeof typedOverride.assets.faviconIco === "string"
                    ? typedOverride.assets.faviconIco
                    : undefined,
                appleTouchIcon:
                  typeof typedOverride.assets.appleTouchIcon === "string"
                    ? typedOverride.assets.appleTouchIcon
                    : undefined,
                manifest:
                  typeof typedOverride.assets.manifest === "string"
                    ? typedOverride.assets.manifest
                    : undefined,
              }
            : undefined,
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
  assets: TenantAssets;
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
      assets: tenant.assets,
      palette: tenant.palette,
    };
  }

  const overrides = mergeCommunityOverrides(
    DEFAULT_COMMUNITY_OVERRIDES,
    parseCommunityOverrides(process.env.NEXT_PUBLIC_COMMUNITY_BRANDING_JSON)
  );
  const communityOverride = overrides[configuredCommunityId];
  if (!communityOverride) {
    return {
      tenantId: tenant.id,
      mode,
      communityId: configuredCommunityId,
      displayName: tenant.userAppName,
      logo: tenant.assets.logo,
      assets: tenant.assets,
      palette: tenant.palette,
    };
  }

  return {
    tenantId: tenant.id,
    mode,
    communityId: configuredCommunityId,
    displayName: communityOverride.name ?? tenant.userAppName,
    logo: communityOverride.logo ?? tenant.assets.logo,
    assets: {
      ...tenant.assets,
      ...(communityOverride.assets ?? {}),
      logo: communityOverride.logo ?? communityOverride.assets?.logo ?? tenant.assets.logo,
    },
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
