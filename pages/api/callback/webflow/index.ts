import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";
import Cryptr from "cryptr";
import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  name?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const webflow = new Webflow();
    const cryptr = new Cryptr(process.env.TOKEN_KEY as string);

    const { access_token } = await webflow.accessToken({
      client_id: process.env.WEBFLOW_CLIENT_ID as string,
      client_secret: process.env.WEBFLOW_SECRET as string,
      code: req.query.code as string,
      redirect_uri: process.env.WEBFLOW_CALLBACK_URL,
    });

    const encryptedString = cryptr.encrypt(access_token);

    let { data, error, status } = await supabaseAdmin
      .from("organizations")
      .update({ webflow_access_token: encryptedString })
      .eq("id", req.query.state as string)
      .select();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      res.redirect(`/organization/${req.query.state}/integrations/add/webflow`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to load data" });
  }
}
