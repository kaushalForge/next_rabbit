const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");

/**
 * Downloads an image from a URL and saves it locally
 * @param {string} url - Image URL
 * @param {string} filename - Filename to save
 * @param {string} folder - Folder to save in (default: 'temp')
 * @returns {Promise<string>} - Full path of saved image
 */
const downloadImage = async (url, filename, folder = "temp") => {
  try {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);

    const buffer = await res.arrayBuffer();
    const filePath = path.join(folder, filename);

    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  } catch (err) {
    console.error("Error downloading image:", err);
    throw err;
  }
};

module.exports = downloadImage;
