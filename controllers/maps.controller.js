const { default: mongoose } = require('mongoose');
const Map = require('../models/map.model');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

exports.uploadImage = async (req, res) => {
  const imagename = req.file.filename;

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