import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./azure";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  if (!repoUrl) {
    return res
      .status(400)
      .json({ error: "Repository URL is required in the request body" });
  }

  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const outputFolderPath = path.join(__dirname, `output/${id}`);
  const files = getAllFiles(outputFolderPath);

  await Promise.all(
    files.map(async (file) => {
      const relativeFilePath = path.relative(outputFolderPath, file);
      await uploadFile(`${id}/${relativeFilePath}`, file);
    })
  );

  publisher.lPush("build-queue", id);

  res.json({ id: id });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
