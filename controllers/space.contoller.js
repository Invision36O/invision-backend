const express = require('express')
const Space = require ('../models/space.model')
const path = require('path');
const fs = require('fs')

exports.spaceData = (req , res) => {
    let {filename, destinationPath} = req.body;

    let space = new Space({
        filename,
        destinationPath,
    })

    space.save().then((space)=>{
        res.status(200).json({"Message":"Space Saved" , space:space})
    }).catch(err=>{
        res.status(500).json({"Message":"Error Saving Space in DB!" , err:err})
    })
}

exports.getData = (req, res) => {
  const dir = path.join(__dirname, '../public/spaceData');
  const latestFilePath = getLatestJSONFile(dir);
  
  if (latestFilePath) {
    res.sendFile(latestFilePath);
  } else {
    res.status(404).send({ error: 'No JSON files found' });
  }
};

const getLatestJSONFile = (dir) => {
  try {
    let latestJSONFile;
    let latestModifiedTime = 0;

    fs.readdirSync(dir).forEach((file) => {
      if (file.endsWith('.json')) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
          const modifiedTime = stats.mtime.getTime();

          if (modifiedTime > latestModifiedTime) {
            latestJSONFile = fullPath;
            latestModifiedTime = modifiedTime;
          }
        }
      }
    });

    return latestJSONFile || null;
  } catch (error) {
    console.error('Error reading directory:', error);
    return null;
  }
};
