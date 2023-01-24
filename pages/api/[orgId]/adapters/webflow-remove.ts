import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";
import Cryptr from "cryptr";
import supabaseAdmin from "utils/supabaseAdmin";

type Data = {
  error?: string;
  status?: string;
};

const handleRemoveWebhook = async (
  site: any,
  trigger_type: string,
  site_id: string
) => {
  let { data } = await supabaseAdmin
    .from("webflow_webhooks")
    .select()
    .eq("site_id", site_id)
    .eq("trigger_type", trigger_type)
    .single();

  if (data) {
    await site.removeWebhook({
      siteId: site_id,
      webhookId: data.webhook_id,
    });

    await supabaseAdmin
      .from("webflow_webhooks")
      .delete()
      .match({ site_id, trigger_type });
  }
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
      const { orgId, site_id } = req.query;
      const decryptedToken = cryptr.decrypt(data.webflow_access_token);
      const webflow = new Webflow({ token: decryptedToken });
      const site = await webflow.site({
        siteId: site_id as string,
      });

      await handleRemoveWebhook(
        site,
        "collection_item_created",
        site_id as string
      );
      await handleRemoveWebhook(
        site,
        "collection_item_changed",
        site_id as string
      );
      await handleRemoveWebhook(
        site,
        "collection_item_deleted",
        site_id as string
      );
      await handleRemoveWebhook(
        site,
        "collection_item_unpublished",
        site_id as string
      );

      res.status(200).json({ status: "done" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
