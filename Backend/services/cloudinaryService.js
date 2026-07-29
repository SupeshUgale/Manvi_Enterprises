const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath, folder = "manvi_products") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: true,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
};
