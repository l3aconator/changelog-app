import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";
import Cryptr from "cryptr";
// import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  error?: string;
  webhooks?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log(req.body);

    res.status(200);
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
