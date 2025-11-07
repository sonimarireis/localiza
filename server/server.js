const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routesDir = path.join(__dirname, 'routes');
if (fs.existsSync(routesDir)) {
  fs.readdirSync(routesDir)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const register = require(path.join(routesDir, file));
      if (typeof register === 'function') {
        register(app);
      }
    });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API ouvindo na porta ${PORT}`);
  });
}

module.exports = app;


