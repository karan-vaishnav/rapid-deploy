import express from "express";
import { BlobServiceClient } from "@azure/storage-blob";

const accountName = "worksforme";
const accountKey =
  "4ewppHmw+UY8U5ZgXYzF7/HDhmqjsMyscj96jXHdBcxpk0BIMeovUs5wHIda995uYpcf3d+gE5+m+AStVJgbeA==";
const containerName = "deployments";

const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

const containerClient = blobServiceClient.getContainerClient(containerName);

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;
const id = host.split(".")[0];
let filePath = req.path


  console.log("host:", host);
  console.log("id:", id);
  console.log("filepath:", filePath);

  const blobClient = containerClient.getBlobClient(`dist/${id}${filePath}`);

  try {
    const downloadBlockBlobResponse = await blobClient.download();

    if (downloadBlockBlobResponse.readableStreamBody) {
      downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error downloading blob:", error);
    res.status(500).send("Internal Server Error");
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
