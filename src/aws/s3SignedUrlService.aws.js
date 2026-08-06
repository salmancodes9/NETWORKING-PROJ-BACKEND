const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const extractObjectKey = (value) => { //function
  if (!value) return null;

  if (value.startsWith("http://") 
    || 
  value.startsWith("https://")
  ) {
    try {
      const parsed = new URL(value);
      return decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    } catch (err) {
      return null;
    }
  }

  return value.replace(/^\//, "");
};

module.exports = async (storedImagePath) => { //imageUrl
  const key = extractObjectKey(storedImagePath);

  if (!key) {
    return storedImagePath || null;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
