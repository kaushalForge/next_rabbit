import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { files: 6 },
});

export const runMulter = (req) =>
  new Promise((resolve, reject) => {
    // Accept multiple files in the field 'images', max 6
    upload.array("images", 6)(req, {}, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
