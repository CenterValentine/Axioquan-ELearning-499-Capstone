// /src/app/api/upload/route.ts

import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// IMPORTANT: Cloudinary supports huge files ONLY when using upload_stream()
// Direct buffer upload has a hidden 10MB limit.

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file → stream (Needed for LARGE FILE uploads)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Correct Cloudinary resource types
    const resourceType =
      type === "video" ? "video" : type === "document" ? "raw" : "image";

    // Correct folder mapping
    const folder =
      type === "video"
        ? "axioquan/videos"
        : type === "document"
        ? "axioquan/documents"
        : "axioquan/courses";

    // WRAP STREAM IN A PROMISE — REQUIRED
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
          chunk_size: 20_000_000, // 20MB chunks for huge files
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return Response.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      duration: uploadResult.duration || 0, // ADDED
      message: "File uploaded successfully",
      bytes: uploadResult.bytes,
    });
  } catch (error: any) {
    console.error("❌ Upload API error:", error);

    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
