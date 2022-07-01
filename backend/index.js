const express = require('express');
const cors = require('cors');
const app = express();
const callsRoutes = require('./routes/api');
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use('/api', callsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
