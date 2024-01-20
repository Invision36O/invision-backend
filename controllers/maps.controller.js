const { default: mongoose } = require('mongoose');
const Map = require('../models/map.model');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

exports.uploadImage = async (req, res) => {
  const imagename = req.file.filename;
  const destinationPath = path.join('..', 'public', 'uploadedImages', `${imagename}.png`)
  const name = req.body.name;

  try{
    const uploadedMap = new Map({
      filename:imagename,
      destinationPath:destinationPath,
      name:name,
    })
  
    uploadedMap.save().then(() => {
          }).catch((err) => {
            console.error(`Error saving in DB:`, err);
          });
  }
  catch(error){
    console.log("Error Saving in DB: " + error)
  }

  try {

    const pythonProcess = spawn('python', ['../scripts/image_processing.py', imagename], {
      cwd: __dirname, 
    });
    pythonProcess.on('exit', (code) => {
      if (code === 0) {
        const roomDataPath = path.join(__dirname, '..', 'public', 'spaceData', `${imagename}.json`);
        let roomData = [];
        if (fs.existsSync(roomDataPath)) {
            roomData = JSON.parse(fs.readFileSync(roomDataPath));
        } 
          res.json({ imagename: imagename, roomData });
      } else {
          res.status(500).json({ error: 'Image processing failed' });
      }
  });
}catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.digitizeImage = async (req, res) => {
  const imagename = req.body.filename;

  try {

    const pythonProcess = spawn('python', ['../scripts/image_processing.py', imagename], {
      cwd: __dirname, 
    });
    pythonProcess.on('exit', (code) => {
      if (code === 0) {
        const roomDataPath = path.join(__dirname, '..', 'public', 'spaceData', `${imagename}.json`);
        let roomData = [];
        if (fs.existsSync(roomDataPath)) {
            roomData = JSON.parse(fs.readFileSync(roomDataPath));
        } 
          res.json({ imagename: imagename, roomData });
      } else {
          res.status(500).json({ error: 'Image processing failed' });
      }
  });
}catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.uploadMap = async (req, res) => {
  const imagename = req.file.filename;
  const destinationPath = path.join('..', 'public', 'uploadedImages', `${imagename}.png`)
  const name = req.body.name;

  try{
    const uploadedMap = new Map({
      filename:imagename,
      destinationPath:destinationPath,
      name:name,
    })
  
    uploadedMap.save().then(() => {
      res.status(200).json(uploadedMap);
          }).catch((err) => {
            console.error(`Error saving in DB:`, err);
          });
  }
  catch(error){
    console.log("Error Saving in DB: " + error)
  }
}

exports.getMaps = async (req,res) => {
  try {
    const maps = await Map.find({}, 'filename name');
    res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    res.status(500).send('Internal Server Error');
  }
}

exports.getMap = async (req, res) => {
  const { filename } = req.params;

  try {
    const map = await Map.findOne({ filename });
    
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }

    res.status(200).json(map);
  } catch (error) {
    console.error('Error fetching map by filename:', error);
    res.status(500).send('Internal Server Error');
  }
};