import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const webflow = new Webflow();
    const url = webflow.authorizeUrl({
      client_id: process.env.WEBFLOW_CLIENT_ID as string,
      redirect_uri: process.env.WEBFLOW_CALLBACK_URL,
      state: req.query.orgId as string,
    });

    res.redirect(url);
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
