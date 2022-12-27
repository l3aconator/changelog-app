import type { NextApiRequest, NextApiResponse } from "next";
import Webflow from "webflow-api";
import Cryptr from "cryptr";
import supabaseAdmin from "utils/supabaseAdmin";

type Site = {
  _id: string;
  createdOn: string;
  name: string;
  shortName: string;
  lastPublished: string;
  previewUrl: string;
  timezone: string;
};

type Collection = {
  _id: string;
  lastUpdated: string;
  createdOn: string;
  name: string;
  slug: string;
  singularName: string;
};

type Data = {
  error?: string;
  sites?: Array<Site>;
  collections?: Array<Collection>;
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

      switch (req.query.type) {
        case "site-id":
          const sites = await webflow.sites();
          res.status(200).json({ sites });
          break;
        case "collection-id":
          const site = await webflow.site({
            siteId: req.query.site_id as string,
          });
          const collections = await site.collections();
          res.status(200).json({ collections });
          break;
        default:
          res.status(500).json({ error: "search type doesn't exist" });
          break;
      }
    }
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
