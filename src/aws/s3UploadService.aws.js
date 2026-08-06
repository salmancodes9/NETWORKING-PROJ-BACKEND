const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = async (fileName, fileBuffer, mimeType, folder = 'posts') => {
  // const key = `posts/${Date.now()}-${fileName}`;
 const key = `${folder}/${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileBuffer, 
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    const s3Url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return s3Url;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw new Error("Failed to upload to S3");
  }
};
