import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });
} else {
  console.error("Missing Cloudinary environment variables!");
}

const uploadTheImage = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      filePath,
      { folder: "techsuryafolder", resource_type: "auto" },
      (err, result) => {
        if (err) {
          if (err.message?.includes("Invalid image file")) {
            return reject(new Error("Invalid image file"));
          }

          if (err.message?.includes("format")) {
            return reject(new Error("Only png, jpg, jpeg formats are allowed"));
          }

          return reject(new Error(err.message));
        }

        resolve(result);
      }
    );
  });
};

export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.v2.uploader.upload(file.path, {
        folder: "Collage_News",
        resource_type: "auto",
      })
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(error);
  }
};

export default uploadTheImage;
