import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/awsUpload";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const urls = [];
    for (const file of files) {
      const url = await uploadToS3(file, "products");
      urls.push(url);
    }

    return NextResponse.json(
      { success: true, urls },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
