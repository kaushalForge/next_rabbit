// Public read-only demo admin account (credentials are shown on the login page).
export const DEMO_ADMIN_EMAIL = "templatescenter@demo.com";
export const DEMO_ADMIN_PASSWORD = "templatescenter";

// Reads the email from the session JWT without verifying it. Safe here because it
// is only used to *deny* requests; every admin route still verifies the token.
export function isDemoAdminToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.email === DEMO_ADMIN_EMAIL;
  } catch {
    return false;
  }
}
