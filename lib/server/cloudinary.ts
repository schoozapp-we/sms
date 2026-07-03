import crypto from "crypto";

type UploadInput = {
  file: File;
  folder: string;
  resourceType?: "image" | "raw" | "auto";
};

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
};

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env vars missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
  }
  return { cloudName, apiKey, apiSecret };
}

function signUpload(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function uploadToCloudinary({ file, folder, resourceType = "auto" }: UploadInput) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const signature = signUpload(params, apiSecret);
  const bytes = Buffer.from(await file.arrayBuffer());

  const formData = new FormData();
  formData.append("file", new Blob([bytes], { type: file.type || "application/octet-stream" }), file.name);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
  return data as CloudinaryUploadResult;
}
