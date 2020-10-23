const {Storage} = require('@google-cloud/storage');
const express = require("express");

const app = new express();

const storage = new Storage({
    projectId: "vfruits-293408",
    keyFilename: "vfruits-293408.json"
 });

let bucketName = "vfruits-293408.appspot.com"

let filename = 'hrach.png';

const uploadFile = async() => {
    await storage.bucket(bucketName).upload(filename, {
        gzip: true,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
  console.log(`${filename} uploaded to ${bucketName}.`);
}

uploadFile();

app.listen(process.env.PORT || 8088, () => { console.log('node server running');})