const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();
mongoose.connect(process.env.DB);
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('BLOGS');
});

const registerRoute = require('./routes/register');
app.use('/api', registerRoute);

const loginRoute = require('./routes/login');
app.use('/api', loginRoute);

const profileRoute = require('./routes/profile');
app.use('/api', profileRoute);

const categoryRoutes = require('./routes/categories');
app.use('/api', categoryRoutes);

const blogRoutes = require('./routes/blogs');
app.use('/api', blogRoutes);

app.listen(3000);