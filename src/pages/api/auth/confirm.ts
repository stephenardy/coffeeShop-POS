import { type EmailOtpType } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

import createClient from "@/utils/supabase/api";

function stringOrFirstString(item: string | string[] | undefined) {
  return Array.isArray(item) ? item[0] : item;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).appendHeader("Allow", "GET").end();
    return;
  }

  const queryParams = req.query;
  const token_hash = stringOrFirstString(queryParams.token_hash);
  const type = stringOrFirstString(queryParams.type);

  let next = "/error";

  if (token_hash && type) {
    const supabase = createClient(req, res);
    console.log("Verifying OTP with:", { token_hash, type }); //debugging
    const { data: userData, error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });
    console.log({ userData, error });
    if (error) {
      console.error("OTP verification failed:", {
        code: error.code,
        message: error.message,
        status: error.status,
      });
    } else {
      next = stringOrFirstString(queryParams.next) || "/auth/login";
    }
  }

  res.redirect(next);
}
