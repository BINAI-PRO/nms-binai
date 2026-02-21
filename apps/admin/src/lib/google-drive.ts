import { google } from "googleapis";

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file"];

function getServiceAccountJwt() {
  const clientEmail = process.env.GOOGLE_OAUTH_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_OAUTH_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error("Credenciales de Google Drive faltantes");
  }
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: DRIVE_SCOPES,
  });
}

export function getDriveClient() {
  const auth = getServiceAccountJwt();
  return google.drive({ version: "v3", auth });
}
