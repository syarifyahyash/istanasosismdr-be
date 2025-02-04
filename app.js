const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();

// Middleware untuk CORS
app.use(cors({
  origin: '*',
}));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan pada ${HOST} port ${PORT}`);
});

app.get('/api', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Selamat Datang di Istana Sosis API!',
  });
});
