const cloudinary = require('../utils/cloudinary');

exports.uploadImages = async (req, res) => {
  try {
    const uploadedUrls = [];

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            uploadedUrls.push(result.secure_url);
            resolve();
          }
        );
        stream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);

    res.status(200).json({ images: uploadedUrls });
  } catch (err) {
    console.error('[Upload Error]', err);
    res.status(500).json({
      message: 'Failed to upload images',
      ...(process.env.NODE_ENV === 'development' && {
        error: err.message,
        stack: err.stack,
      }),
    });
  }
};
