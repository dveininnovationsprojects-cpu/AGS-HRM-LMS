const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB) || 10;

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createStorage = (subDir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(uploadDir, subDir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${uuidv4()}${ext}`;
      cb(null, filename);
    },
  });
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only document files are allowed'), false);
  }
};

const anyFileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif|webp|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Upload instances
const uploadAvatar = multer({
  storage: createStorage('avatars'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for avatars
  fileFilter: imageFilter,
}).single('avatar');

const uploadDocument = multer({
  storage: createStorage('documents'),
  limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
  fileFilter: documentFilter,
}).single('document');

const uploadResume = multer({
  storage: createStorage('resumes'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: documentFilter,
}).single('resume');

const uploadCourseContent = multer({
  storage: createStorage('courses'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for course files
  fileFilter: anyFileFilter,
}).single('content');

const uploadMultipleDocuments = multer({
  storage: createStorage('documents'),
  limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
  fileFilter: anyFileFilter,
}).array('documents', 10);

/**
 * Middleware wrapper that handles multer errors
 */
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(413).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

/**
 * Get public URL for an uploaded file
 */
const getFileUrl = (req, filePath) => {
  const relativePath = filePath.replace(/\\/g, '/').replace(uploadDir, '');
  return `${process.env.APP_URL || 'http://localhost:3000'}/uploads${relativePath}`;
};

module.exports = {
  handleUpload,
  uploadAvatar: handleUpload(uploadAvatar),
  uploadDocument: handleUpload(uploadDocument),
  uploadResume: handleUpload(uploadResume),
  uploadCourseContent: handleUpload(uploadCourseContent),
  uploadMultipleDocuments: handleUpload(uploadMultipleDocuments),
  getFileUrl,
};
