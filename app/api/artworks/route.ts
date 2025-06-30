import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const image = formData.get("image") as File
    const title = formData.get("title")?.toString() || "Sem título"
    const description = formData.get("description")?.toString() || ""
    const tags = JSON.parse(formData.get("tags")?.toString() || "[]")
    const category = formData.get("category")?.toString() || ""

    if (!image || !image.name) {
      return NextResponse.json({ success: false, error: "Imagem inválida." }, { status: 400 })
    }

    const fileExt = image.name.split(".").pop()
    const fileName = `${Date.now()}-${randomUUID()}.${fileExt}`

    const { data, error: uploadError } = await supabase.storage
      .from("portfolioimages")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 })
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio_images/${fileName}`

    // Registro no banco (opcional)
    const { error: dbError } = await supabase.from("images").insert([
      {
        title,
        description,
        category,
        tags,
        image_url: imageUrl,
        filename: fileName,
        created_at: new Date().toISOString()
      }
    ])

    if (dbError) {
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, imageUrl })
  } catch (err: any) {
    console.error("Erro interno:", err)
    return NextResponse.json({ success: false, error: "Erro interno no servidor." }, { status: 500 })
  }
}
