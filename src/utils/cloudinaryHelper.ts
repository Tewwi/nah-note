import { env } from "~/env.mjs";
import type { IUploadImageResp } from "~/interface/typeImageResp";

export const handleUploadFile = async (
  file: File,
  signature: string,
  timestamp: string,
  folderName: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("folder", folderName);

  const resp = await fetch(`${env.NEXT_PUBLIC_CLOUDINARY_API}`, {
    method: "POST",
    body: formData,
  });

  const data = (await resp.json()) as IUploadImageResp;

  return data;
};
