import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";
import Cryptr from "cryptr";
import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const cryptr = new Cryptr(process.env.TOKEN_KEY as string);

    let { data, error, status } = await supabaseAdmin
      .from("organizations")
      .select()
      .eq("id", req.query.orgId as string)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      const decryptedToken = cryptr.decrypt(data.webflow_access_token);
      const webflow = new Webflow({ token: decryptedToken });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
