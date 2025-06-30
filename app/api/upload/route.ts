import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tags = formData.get("tags") as string;

  if (!file || !title) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const filename = `${uuidv4()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const { data: storageData, error: storageError } = await supabase.storage
    .from("portfolio")
    .upload(filename, arrayBuffer, {
      contentType: file.type,
    });

  if (storageError) {
    return new Response(JSON.stringify({ error: storageError.message }), { status: 500 });
  }

  const image_url = `https://nxgkpvxhajxdcsnprmpj.supabase.co/storage/v1/object/public/portfolio/${filename}`;

  const { error: insertError } = await supabase.from("portfolio_images").insert([{
    image_url,
    title,
    description,
    tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    created_at: new Date().toISOString(),
  }]);

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, image_url }), { status: 200 });
}