const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.port || 3001;
const bodyParser = require('body-parser')
const cors = require('cors');
const Grid = require('gridfs-stream');
app.use(cors( { origin: '*' , } ));
app.use(cors( { origin: 'http://localhost:3000/' , } ));
app.use(cors());


const userRoute = require('./routes/users.routes')
const mapRoutes = require('./routes/maps.routes')
const modelRoutes = require('./routes/models.routes')
const spaceRoutes = require('./routes/space.routes')
const frontElevationRoutes = require('./routes/frontelevation.routes')
const ObjectRoutes =require('./routes/3Dobjects.routes')

const photoRoutes = require('./routes/photo.routes')


app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use('/user',userRoute);
app.use('/map', mapRoutes);
app.use('/model', modelRoutes);
app.use('/space', spaceRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/public',express.static('public'))
app.use('/modeluploads', express.static(path.join(__dirname, 'modeluploads')));
app.use('/uploadedImages', express.static(path.join('public', 'uploadedImages')));
app.use('/processedImages', express.static(path.join('public', 'processedImages')));
app.use('/models', express.static(path.join(__dirname, 'public/models')));
app.use('/3DCatalogue', express.static('3DCatalogue'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors( { origin: '*' , } ));






mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Invision360',
})
.then(() => {
  console.log('Connected to MongoDB');
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'models'
  });
  app.locals.gridFSBucket = gridFSBucket;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/frontelevation/models/:fileId', async (req, res) => {
  try {
    const gridFSBucket = req.app.locals.gridFSBucket;
    const _id = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gridFSBucket.find({ _id }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).send('No file found');
    }
    const downloadStream = gridFSBucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/', (req, res) => {
    res.send(`Server is running on NodeJS:${port}`);
});

app.get('/getData', (req, res) => {
  const jsonFilePath = path.join(__dirname, './public/spaceData/image.json');
  res.sendFile(jsonFilePath);
  
});const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.port || 3001;
const bodyParser = require('body-parser')
const cors = require('cors');
const Grid = require('gridfs-stream');
app.use(cors( { origin: '*' , } ));
app.use(cors( { origin: 'http://localhost:3000/' , } ));
app.use(cors());


const userRoute = require('./routes/users.routes')
const mapRoutes = require('./routes/maps.routes')
const modelRoutes = require('./routes/models.routes')
const spaceRoutes = require('./routes/space.routes')
const frontElevationRoutes = require('./routes/frontelevation.routes')
const ObjectRoutes =require('./routes/3Dobjects.routes')


app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use('/user',userRoute);
app.use('/map', mapRoutes);
app.use('/model',modelRoutes);
app.use('/space', spaceRoutes);
app.use('/frontelevation',frontElevationRoutes);
app.use('/objects3D',ObjectRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/public',express.static('public'))
// app.use('/modeluploads', express.static(path.join(__dirname, 'modeluploads')));
app.use('/uploadedImages', express.static(path.join('public', 'uploadedImages')));
app.use('/processedImages', express.static(path.join('public', 'processedImages')));
app.use('/models', express.static(path.join(__dirname, 'public/models')));
app.use('/3DCatalogue', express.static('3DCatalogue'));
// app.use('/modeluploads', express.static('modeluploads'));
app.use('/modeluploads', express.static('modeluploads'));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors( { origin: '*' , } ));






mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Invision360',
})
.then(() => {
  console.log('Connected to MongoDB');
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'models'
  });
  app.locals.gridFSBucket = gridFSBucket;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/frontelevation/models/:fileId', async (req, res) => {
  try {
    const gridFSBucket = req.app.locals.gridFSBucket;
    const _id = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await gridFSBucket.find({ _id }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).send('No file found');
    }
    const downloadStream = gridFSBucket.openDownloadStream(_id);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/', (req, res) => {
    res.send(`Server is running on NodeJS:${port}`);
});

app.get('/getData', (req, res) => {
  const jsonFilePath = path.join(__dirname, './public/spaceData/image.json');
  res.sendFile(jsonFilePath);
  
});