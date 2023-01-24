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

interface FullCollection extends Collection {
  fields?: Array<CollectionField>;
}

type BaseCollectionField = {
  slug: string;
  name: string;
  id: string;
};

interface CollectionField extends BaseCollectionField {
  type:
    | "Bool"
    | "Color"
    | "Date"
    | "ExtFileRef"
    | "Set"
    | "ImageRef"
    | "Set"
    | "ItemRef"
    | "ItemRefSet"
    | "Link"
    | "Number"
    | "Option"
    | "PlainText"
    | "RichText"
    | "Video"
    | "User"
    | string;
  required: boolean;
  editable: boolean;
  validations?: Record<string, string | number | boolean | object>;
}

type Data = {
  error?: string;
  collection?: FullCollection;
  sites?: Array<Site>;
  collections?: Array<Collection>;
  collectionFields?: Array<BaseCollectionField>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cryptr = new Cryptr(process.env.TOKEN_KEY as string);

  try {
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
        case "get-collection":
          const site2 = await webflow.site({
            siteId: req.query.site_id as string,
          });

          const collection = await site2.collection({
            collectionId: req.query.collection_id,
          } as { collectionId: string });

          const collectionFields = collection.fields.map((field) => {
            return {
              slug: field.slug,
              name: field.name,
              id: field.id,
            };
          });

          res.status(200).json({ collection, collectionFields });
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
