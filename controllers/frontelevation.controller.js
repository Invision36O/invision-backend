const FrontElevation = require('../models/frontelevation.model'); // Ensure the path matches your file structure
const path = require("path");
const fs = require("fs");
const extract = require('extract-zip');
const multer = require('multer'); // Ensure multer is installed
const parentDirectory = path.join(__dirname, "..");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const subfolderName = Date.now().toString();
    const subfolderPath = path.join(parentDirectory, 'modeluploads', subfolderName);
    fs.mkdirSync(subfolderPath, { recursive: true });
    cb(null, subfolderPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Helper function to determine content type
function getContentType(fileExtension) {
  if (fileExtension === '.obj') {
    return `model/${fileExtension.substr(1)}`;
  }
  return 'application/octet-stream';
}

exports.uploadModel = upload.single('model'), async (req, res) => {
  console.log('Working in upload model')

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filename = req.file.originalname;
  const destinationPath = req.file.destination;
  const modelURL = path.join(destinationPath, filename);
  
  const newModel = new FrontElevation({
    name: req.body.name,
    style: req.body.style,
    colorScheme: req.body.colorScheme,
    modelPath: modelURL,
  });

  try {
    await newModel.save();
    console.log(`Model saved in DB`);
    res.status(201).json({ message: "Model uploaded successfully", modelURL });
  } catch (error) {
    console.error(`Error saving model in DB:`, error);
    res.status(500).json({ message: error.message });
  }
};

exports.uploadFolder = upload.single('folder'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No folder uploaded.' });
  }

  const tempPath = req.file.path;
  const subfolderName = Date.now().toString();
  const subfolderPath = path.resolve(parentDirectory, 'modeluploads', subfolderName);

  await extract(tempPath, { dir: subfolderPath });
  fs.unlinkSync(tempPath);

  const gltfGlbFiles = [];
  findObjFiles(subfolderPath, gltfGlbFiles);

  res.json({ files: gltfGlbFiles });
};

function findObjFiles(folderPath, fileList, style, colorScheme){
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && path.extname(file) === '.obj') {
      const newModel = new FrontElevation({
        name: file, // Consider adjusting this based on your needs
        style: style, // Use the provided style
        colorScheme: colorScheme, // Use the provided colorScheme
        modelPath: filePath,
      });

      newModel
        .save()
        .then(() => console.log(`Model saved in DB`))
        .catch(err => console.error(`Error saving model in DB:`, err));

      fileList.push(filePath.replace(parentDirectory, '').replace(/\\/g, '/'));
    } else if (stat.isDirectory()) {
      findObjFiles(filePath, fileList);
    }
  });
}

exports.getAllModels = async (req, res) => {
  try {
    const models = await FrontElevation.find({});
    res.json(models);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getModelByStyleAndColor = async (req, res) => {
  const { style, colorScheme } = req.query;
  try {
    const models = await FrontElevation.find({ style, colorScheme });
    res.json(models);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
