// acc-key: 4ewppHmw+UY8U5ZgXYzF7/HDhmqjsMyscj96jXHdBcxpk0BIMeovUs5wHIda995uYpcf3d+gE5+m+AStVJgbeA==
// acc name: worksforme
//cont-name:deployments

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import path from "path";
import fs from "fs";

const accountName = "worksforme";
const accountKey =
  "4ewppHmw+UY8U5ZgXYzF7/HDhmqjsMyscj96jXHdBcxpk0BIMeovUs5wHIda995uYpcf3d+gE5+m+AStVJgbeA==";
const containerName = "deployments";

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadFile = async (fileName: string, localFilePath: string) => {
  console.log("called");

  const fileContent = fs.readFileSync(localFilePath);

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const options = {
    blobHTTPHeaders: { blobContentType: "application/octet-stream" },
  };

  const uploadResponse = await blockBlobClient.upload(
    fileContent,
    fileContent.length,
    options
  );
  console.log(uploadResponse);
};
