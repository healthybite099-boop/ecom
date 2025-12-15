import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 🔹 normalize CloudFront URL
const getCloudFrontBaseUrl = () => {
  let url = process.env.CLOUDFRONT_URL || "";

  // add https if missing
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  // remove trailing slash
  return url.replace(/\/$/, "");
};

export const uploadToS3 = async (file, folder = "uploads") => {
  const buffer = Buffer.from(await file.arrayBuffer());

  // 🔹 sanitize filename (remove spaces & special chars)
  const safeName = file.name.replace(/\s+/g, "-");
  const fileName = `${folder}/${uuidv4()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  // ✅ ALWAYS return valid absolute URL
  const cloudFrontUrl = getCloudFrontBaseUrl();
  return `${cloudFrontUrl}/${fileName}`;
};
