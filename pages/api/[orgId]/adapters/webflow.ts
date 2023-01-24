// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name?: string;
  error?: string;
};

const access_token =
  "8cabeeff3b21786f9f5887054f9307484bd120c4554cf4b27599a2b4ea37c851";
const site_id = "61147776bffed57ff3e884ef";
const collection_id = "6367f9b7ca5ec44204c3820d";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const url = `https://api.webflow.com/collections/${collection_id}/items?access_token=${access_token}`;
    const options = { method: "GET", headers: { accept: "application/json" } };
    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);

    // need sync table, last sync, how many were sync'd
    // need synced items table
    // what sync it came from
    // pub date for each
    // ---
    // how do we handle duplicates?
    // schema:
    // - post date
    // - name
    // - slug
    // - categories
    // - tags
    // - content (as html)
    // - id from external system

    res.status(200).json({ name: "done" });
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }
}
