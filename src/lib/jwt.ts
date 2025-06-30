import { jwtDecode } from "jwt-decode";

export function getUserRoleFromToken(token: string): string | null {
  try {
    const decodedToken = jwtDecode(token) as {
      user_role?: string;
      sub?: string;
    };
    return decodedToken.user_role || null;
  } catch (decodeError) {
    console.error(
      "Failed to decode access token in getServerSideProps:",
      decodeError
    );
    return null;
  }
}
