const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.port || 3001;
const bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors( { origin: '*' , } ));

const userRoute = require('./routes/users.routes')
const mapRoutes = require('./routes/maps.routes')
const modelRoutes = require('./routes/models.routes')

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}));
app.use('/user',userRoute);
app.use('/map', mapRoutes);
app.use('/model',modelRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/public',express.static('public'))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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