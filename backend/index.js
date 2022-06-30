const express = require('express');
const app = express();
const callsRoutes = require('./routes/api');
const PORT = 3001;

app.use(express.json());
app.use('/api', callsRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
