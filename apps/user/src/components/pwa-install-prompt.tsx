"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getEffectiveUserBranding } from "@/lib/tenant-branding";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

type PromptVariant = "install" | "ios" | "hidden";

const INSTALL_STATE_KEY = "nms-user-pwa-install-state";
const DISMISS_SESSION_KEY = "nms-user-pwa-install-dismissed-session";
const SHOWN_SESSION_KEY = "nms-user-pwa-install-shown-session";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    ((window.navigator as Navigator & { standalone?: boolean }).standalone ?? false)
  );
}

function isIosDevice() {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

function shouldSkipPrompt() {
  if (typeof window === "undefined") return true;
  const installed = window.localStorage?.getItem(INSTALL_STATE_KEY) === "installed";
  const dismissed = window.sessionStorage?.getItem(DISMISS_SESSION_KEY) === "1";
  const shown = window.sessionStorage?.getItem(SHOWN_SESSION_KEY) === "1";
  return installed || dismissed || shown || isStandaloneMode();
}

export function PwaInstallPrompt() {
  const branding = getEffectiveUserBranding();
  const appLabel = branding.displayName || "la app";
  const iconSrc = branding.assets.logo;

  const [variant, setVariant] = useState<PromptVariant>("hidden");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      } else {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => registrations.forEach((registration) => registration.unregister()))
          .catch(() => undefined);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shouldSkipPrompt()) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.sessionStorage?.setItem(SHOWN_SESSION_KEY, "1");
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVariant("install");
    };

    const handleAppInstalled = () => {
      window.localStorage?.setItem(INSTALL_STATE_KEY, "installed");
      window.sessionStorage?.removeItem(DISMISS_SESSION_KEY);
      setDeferredPrompt(null);
      setVariant("hidden");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    let iosTimer: number | undefined;
    if (isIosDevice()) {
      iosTimer = window.setTimeout(() => {
        setVariant((current) => {
          if (current !== "hidden") return current;
          window.sessionStorage?.setItem(SHOWN_SESSION_KEY, "1");
          return "ios";
        });
      }, 0);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (iosTimer !== undefined) {
        window.clearTimeout(iosTimer);
      }
    };
  }, []);

  if (variant === "hidden") return null;

  const hideForSession = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage?.setItem(DISMISS_SESSION_KEY, "1");
    }
    setVariant("hidden");
    setDeferredPrompt(null);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      hideForSession();
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        window.localStorage?.setItem(INSTALL_STATE_KEY, "installed");
      } else {
        window.sessionStorage?.setItem(DISMISS_SESSION_KEY, "1");
      }
    } catch {
      window.sessionStorage?.setItem(DISMISS_SESSION_KEY, "1");
    } finally {
      setVariant("hidden");
      setDeferredPrompt(null);
    }
  };

  const title =
    variant === "install"
      ? `Instala ${appLabel}`
      : `Agrega ${appLabel} a tu pantalla de inicio`;

  const description =
    variant === "install"
      ? "Instala la app para abrirla directo desde tu celular con mejor experiencia."
      : "En iPhone o iPad: abre esta app en Safari y sigue estos pasos.";

  const iosSteps = [
    "Toca el icono Compartir en Safari.",
    'Selecciona "Agregar a pantalla de inicio".',
    'Confirma tocando "Agregar".',
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-24 lg:pb-6">
      <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-[var(--border)] bg-white/95 p-4 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.45)] ring-1 ring-black/5 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
            <Image src={iconSrc} alt={appLabel} width={48} height={48} className="h-10 w-10 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
          </div>
          <button
            type="button"
            onClick={hideForSession}
            aria-label="Cerrar recomendacion de instalacion"
            className="ml-1 rounded-full p-1.5 text-[var(--muted)] transition hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
          >
            &times;
          </button>
        </div>

        {variant === "install" ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleInstallClick()}
              className="w-full rounded-2xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Instalar
            </button>
            <button
              type="button"
              onClick={hideForSession}
              className="w-full rounded-2xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--primary)]/5"
            >
              Mas tarde
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[var(--background)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                Instalacion en iOS
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-[var(--muted)]">
                {iosSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <button
              type="button"
              onClick={hideForSession}
              className="w-full rounded-2xl border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)] transition hover:bg-[var(--primary)]/5"
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
