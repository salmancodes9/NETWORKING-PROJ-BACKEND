const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const pickFirstUploadedFile = (req, res, next) => {
	if (Array.isArray(req.files) && req.files.length > 0 && !req.file) {
		req.file = req.files[0];
	}

	next();
};

module.exports = {
	upload,
	pickFirstUploadedFile,
};