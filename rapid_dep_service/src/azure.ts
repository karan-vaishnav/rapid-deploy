import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobClient,
} from "@azure/storage-blob";
import fs from "fs";
import path from "path";

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

export async function downloadAzureFolder(prefix: string) {
  const iter = containerClient.listBlobsFlat({ prefix: prefix });
  for await (const blob of iter) {
    if (blob.name && typeof blob.name === "string") {
      const finalOutputPath = path.join(__dirname, blob.name);
      const dirName = path.dirname(finalOutputPath);

      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      try {
        await blockBlobClient.downloadToFile(finalOutputPath);
        console.log(
          `Downloaded blob "${blob.name}" to "${finalOutputPath}" successfully.`
        );
      } catch (error) {
        console.error(`Error downloading blob "${blob.name}":`, error);
      }
    }
  }
}

export async function uploadFile(fileName: string, localFilePath: string) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const fileContent = fs.readFileSync(localFilePath);

  try {
    await blockBlobClient.upload(fileContent, fileContent.length);
    console.log(
      `Uploaded file "${fileName}" from "${localFilePath}" successfully.`
    );
  } catch (error) {
    console.error(`Error uploading file "${fileName}":`, error);
  }
}

export async function copyFinalDist(id: string) {
  const folderPath = path.join(__dirname, `${id}/build`);
  const allFiles = getAllFiles(folderPath);

  allFiles.forEach(async (file) => {
    const fileName = `dist/${id}/` + file.slice(folderPath.length + 1);
    await uploadFile(fileName, file);
  });
}

function getAllFiles(folderPath: string): string[] {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}
