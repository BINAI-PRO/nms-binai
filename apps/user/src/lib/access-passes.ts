import QRCode from "qrcode";

export type AccessPassType = "visitor" | "service";
export type AccessPassStatus = "active" | "revoked" | "expired" | "used_up";

export type AccessPassRow = {
  id: string;
  community_id: string;
  type: AccessPassType;
  label: string;
  token: string;
  qr_payload: string | null;
  status: AccessPassStatus;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  used_count: number;
  last_used_at: string | null;
  created_at: string;
};

export function getEffectivePassStatus(
  pass: Pick<AccessPassRow, "status" | "valid_until" | "used_count" | "max_uses">,
  nowTimestamp = Date.now()
): AccessPassStatus {
  if (pass.status === "revoked" || pass.status === "used_up") return pass.status;
  if (new Date(pass.valid_until).getTime() < nowTimestamp) return "expired";
  if (pass.used_count >= pass.max_uses) return "used_up";
  return "active";
}

export async function buildPassQrDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0F172A",
        light: "#FFFFFFFF",
      },
    });
  } catch {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(payload)}`;
  }
}

export async function decorateAccessPass(
  pass: AccessPassRow,
  nowTimestamp = Date.now()
) {
  const qrData = pass.qr_payload?.trim().length ? pass.qr_payload : pass.token;

  return {
    ...pass,
    effective_status: getEffectivePassStatus(pass, nowTimestamp),
    qr_image_url: await buildPassQrDataUrl(qrData),
  };
}
