const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});