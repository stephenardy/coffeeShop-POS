import { jwtDecode } from "jwt-decode";

export function getUserRoleFromToken(token: string): string | null {
  try {
    // decode the jwt token and get the payload
    const decodedToken = jwtDecode(token) as {
      user_role?: string; // user role [admin | crew | manager]
      sub?: string; // user id (optional)
    };

    // console.log("=== TOKEN DEBUG ===");
    // console.log("Full decoded token:", JSON.stringify(decodedToken, null, 2));
    // console.log("user_role:", decodedToken.user_role);
    // console.log("All keys:", Object.keys(decodedToken));
    // console.log("=== END DEBUG ===");

    return decodedToken.user_role || null;
  } catch (decodeError) {
    console.error(
      "Failed to decode access token in getServerSideProps:",
      decodeError
    );
    return null;
  }
}

// What this code do is extracting user claims (including the custom claims) from the session.access_token
// I store the user_role inside the custom claims, implemented through auth hooks in supabase
