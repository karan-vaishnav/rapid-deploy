"use strict";
// acc-key: 4ewppHmw+UY8U5ZgXYzF7/HDhmqjsMyscj96jXHdBcxpk0BIMeovUs5wHIda995uYpcf3d+gE5+m+AStVJgbeA==
// acc name: worksforme
//cont-name:deployments
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const fs_1 = __importDefault(require("fs"));
const accountName = "worksforme";
const accountKey = "4ewppHmw+UY8U5ZgXYzF7/HDhmqjsMyscj96jXHdBcxpk0BIMeovUs5wHIda995uYpcf3d+gE5+m+AStVJgbeA==";
const containerName = "deployments";
const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(containerName);
const uploadFile = (fileName, localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("called");
    const fileContent = fs_1.default.readFileSync(localFilePath);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const options = {
        blobHTTPHeaders: { blobContentType: "application/octet-stream" },
    };
    const uploadResponse = yield blockBlobClient.upload(fileContent, fileContent.length, options);
    console.log(uploadResponse);
});
exports.uploadFile = uploadFile;
