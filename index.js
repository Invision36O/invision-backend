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
app.use(cors( { origin: '*' , } ));
app.use(cors( { origin: 'http://localhost:3000/' , } ));
app.use(cors());


const userRoute = require('./routes/users.routes')
const mapRoutes = require('./routes/maps.routes')
const modelRoutes = require('./routes/models.routes')
const spaceRoutes = require('./routes/space.routes')

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use('/user',userRoute);
app.use('/map', mapRoutes);
app.use('/model',modelRoutes);
app.use('/space', spaceRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/public',express.static('public'))
app.use('/uploadedImages', express.static(path.join('public', 'uploadedImages')));

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

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
    res.send(`Server is running on NodeJS:${port}`);
});

app.get('/getData', (req, res) => {
  const jsonFilePath = path.join(__dirname, './public/spaceData/image.json');
  res.sendFile(jsonFilePath);
  
});