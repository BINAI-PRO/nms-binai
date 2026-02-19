import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Simple i18n provider anchored to es-MX for now.
 * Architecture leaves room to swap messages when we add more locales.
 */
export function IntlProvider({ children }: Props) {
  // Temporary passthrough provider to avoid requiring next-intl runtime config
  // while the project uses hardcoded Spanish UI strings.
  return <>{children}</>;
}
