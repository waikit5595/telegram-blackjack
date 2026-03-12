import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getDatabase, Database } from "firebase-admin/database";

let app: App;
let adminAuth: Auth;
let adminDb: Database;

function getEnv(name: string) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const projectId = getEnv("FIREBASE_PROJECT_ID");
  const clientEmail = getEnv("FIREBASE_CLIENT_EMAIL");
  const privateKey = getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const databaseURL = getEnv("FIREBASE_DATABASE_URL");

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL,
  });
}

app = getAdminApp();
adminAuth = getAuth(app);
adminDb = getDatabase(app);

export { adminAuth, adminDb };