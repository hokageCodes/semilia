const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middleware/auth');
const { uploadImages } = require('../controllers/uploadController');

const router = express.Router();

// Use in-memory storage (no temp files on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.array('images', 5), uploadImages, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ecommerce',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload failed:', error);
          return res.status(500).json({ message: 'Cloudinary error', error });
        }

        return res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error('❌ Upload route failed:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
