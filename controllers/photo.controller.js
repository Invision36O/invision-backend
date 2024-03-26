const { default: mongoose } = require('mongoose');
const Photo = require('../models/photo.model');
const path = require('path');
const fs = require("fs");

exports.uploadImages = (req, res) => {
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
  
    const subfolderName = Date.now().toString();
    const subfolderPath = path.join('uploads/photo', subfolderName).replace(/\\/g, '/');
    fs.mkdirSync(subfolderPath, { recursive: true });
    const uploadedFileURLs = [];
  
    req.files.forEach(async(file) => {
      let filename = file.originalname;
      const fileExtension = path.extname(file.originalname);
      const photoURL = path.join(subfolderPath, filename).replace(/\\/g, '/');
      uploadedFileURLs.push(photoURL);
  
      const destinationPath = subfolderPath + "/" + filename;
  
      const newPhoto = new Photo({
        filename: filename,
        destinationPath: destinationPath,
      });
  
      await newPhoto
        .save()
        .then(() => {
          console.log(`Photo saved in DB`);
          const parentDirectory = path.join(__dirname, "..", subfolderPath);
          res.status(200).json({ subfolderpath: parentDirectory, imageURL: subfolderPath });
        })
        .catch((err) => {
          console.error(`Error saving photo in DB:`, err);
        });
  
      fs.renameSync(file.path, photoURL);
    });
    
};

exports.findImage = async (req, res) => {
    try {
        const  subfolderPath  = req.body.subfolderPath;
        const regexPattern = new RegExp(`^${subfolderPath}`);
        const images = await Photo.findOne({ destinationPath: { $regex: regexPattern } }).exec();

        if (!images || images.length === 0) {
            return res.status(404).json({ message: 'No images found with the specified destination path.' });
        }

        res.status(200).json({ images });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
  

const { exec } = require('child_process');

exports.runMeshroom = (req, res) => {
  
    const subfolderPath = req.body.subfolderPath;
    console.log("subfolderpath:" + subfolderPath)

    const meshroomCommand = `meshroom_batch --input ${subfolderPath} --output "C:\\Users\\engss\\Desktop"`;

    const childProcess = exec(meshroomCommand);

    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
        console.log(`Meshroom process exited with code ${code}`);
    });
};