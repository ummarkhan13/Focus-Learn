// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const journeyRoutes = require('./routes/journey');
const chapterRoutes = require('./routes/chapterRoutes');
const noteRoutes = require('./routes/noteRoutes');

dotenv.config();
const port = process.env.PORT||5000;
const app = express();
app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true,
  }));

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', journeyRoutes);
app.use('/api/v1/journeys', chapterRoutes);
app.use('/api/v1', noteRoutes); 

app.get('/', (req,res)=>{
    res.send("<h1> This api is working </h1>")
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});