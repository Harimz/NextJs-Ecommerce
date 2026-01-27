import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
export const r2Bucket = process.env.R2_BUCKET!;
export const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL!;

console.log(accountId, accessKeyId, secretAccessKey);

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },

  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function createPresignedPutUrl(opts: {
  key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: r2Bucket,
    Key: opts.key,
    // ContentType: opts.contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 60 });

  const publicUrl = `${r2PublicBaseUrl.replace(/\/$/, "")}/${opts.key.replace(/^\//, "")}`;

  return { uploadUrl, publicUrl };
}

export async function deleteR2Object(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: r2Bucket,
      Key: key.replace(/^\//, ""),
    }),
  );
}
