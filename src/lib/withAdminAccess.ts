import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { requireAdmin } from "./checkAdmin";

export function withAdminAccess(gssp: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    const check = await requireAdmin(context);

    if (check) {
      // If not allowed, return the redirect from requireAdmin
      if ("redirect" in check) return check;

      // Run the actual page's GSSP
      const gsspResult = await gssp(context);

      return {
        ...gsspResult,
        props: {
          ...(gsspResult as any).props,
          ...(check as any).props,
        },
      };
    }
  };
}
