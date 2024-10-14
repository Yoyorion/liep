// netlify/functions/getFiles.js

const fs = require('fs');
const path = require('path');

exports.handler = async function() {
  const imagesDir = path.join(__dirname, '../../images');
  try {
    const files = fs.readdirSync(imagesDir);
    const mediaFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|mp4|avi|mov)$/i.test(file));

    return {
      statusCode: 200,
      body: JSON.stringify(mediaFiles),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de la lecture des fichiers' }),
    };
  }
};