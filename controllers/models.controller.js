const Model = require('../models/modelscan.model');
const path = require("path");
const fs = require("fs");
const extract = require('extract-zip');
const parentDirectory = path.join(__dirname, "..");

function getContentType(fileExtension) {
  if (fileExtension === '.gltf' || fileExtension === '.glb') {
    return `model/${fileExtension.substr(1)}`;
  }
  return 'application/octet-stream';
}

exports.uploadModel = (req, res) => {
  console.log('Working in upload model')

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const subfolderName = Date.now().toString();
    const subfolderPath = path.join('uploads', subfolderName);
    fs.mkdirSync(subfolderPath, { recursive: true });
    const uploadedFileURLs = [];
    let modelName;

    req.files.forEach((file) => {
      let filename = file.originalname;
      const fileExtension = path.extname(file.originalname);

      if (fileExtension === '.gltf' || fileExtension === '.glb') {
        modelName = '/' + filename;
      }

      const modelURL = path.join(subfolderPath, filename);
      uploadedFileURLs.push(modelURL);

      const contentType = getContentType(fileExtension);

      const newModel = new Model({
        filename: filename,
        destinationPath: subfolderPath,
      });

      newModel
        .save()
        .then(() => {
          console.log(`Saved in DB`);
        })
        .catch((err) => {
          console.error(`Error saving in DB:`, err);
        });
        
      fs.renameSync(file.path, modelURL);
      
    });
    res.status(200).json({subfolderpath:subfolderPath+modelName});
};


exports.uploadFolder = async (req, res) => {

  const tempPath = req.file.path;

  const subfolderName = Date.now().toString();
  const subfolderPath = path.resolve('uploads', subfolderName);
  await extract(tempPath, { dir: subfolderPath });
  fs.unlinkSync(tempPath);
  function findGltfGlbFiles(folderPath, fileList) {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (path.extname(file) === '.gltf' || path.extname(file) === '.glb')) {
        const newModel = new Model({
          filename: file,
          destinationPath: subfolderName,
        });
      
        newModel
          .save()
          .then(() => {
            console.log(`Saved in DB`);
          })
          .catch((err) => {
            console.error(`Error saving in DB:`, err);
          });
        fileList.push(path.join(subfolderName, file).replace(/\\/g, '/'));
      } else if (stat.isDirectory()) {
        findGltfGlbFiles(filePath, fileList);
      }
    });
  }

  const gltfGlbFiles = [];
  findGltfGlbFiles(subfolderPath, gltfGlbFiles);

  return res.json({ files: gltfGlbFiles });
};

