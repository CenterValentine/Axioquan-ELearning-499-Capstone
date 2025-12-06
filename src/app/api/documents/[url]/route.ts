import { NextRequest, NextResponse } from "next/server";

/**
 * This is a proxy endpoint that serves documents with correct Content-Type headers
 * This fixes/ensures that PDFs and other documents are served with proper MIME types
 * for iframe or object embedding, even when Cloudinary doesn't set them correctly
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ url: string }> }
) {
  try {
    const { url } = await params;

    // Decode the URL (it's base64 encoded in the route)
    const decodedUrl = decodeURIComponent(
      Buffer.from(url, "base64").toString("utf-8")
    );

    // Fetch the document from Cloudinary
    const response = await fetch(decodedUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch document" },
        { status: response.status }
      );
    }

    // Get the file content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine Content-Type from URL or response
    let contentType = response.headers.get("content-type");

    // If Cloudinary didn't provide a content type, detect from URL or file content
    if (!contentType || contentType === "application/octet-stream") {
      const urlLower = decodedUrl.toLowerCase();

      if (urlLower.includes(".pdf") || urlLower.includes("/pdf")) {
        contentType = "application/pdf";
      } else if (urlLower.match(/\.(txt|sql|rtf|md|markdown)$/)) {
        contentType = "text/plain";
      } else if (urlLower.match(/\.(doc|docx)$/)) {
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (urlLower.match(/\.(ppt|pptx)$/)) {
        contentType =
          "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      } else if (urlLower.match(/\.(xls|xlsx|csv)$/)) {
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      } else {
        // Check file content for PDF magic bytes
        if (buffer.length > 4 && buffer.toString("ascii", 0, 4) === "%PDF") {
          contentType = "application/pdf";
        } else {
          contentType = "application/octet-stream";
        }
      }
    }

    // Return the file with correct Content-Type and CORS headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": `inline; filename="document"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Document proxy error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
