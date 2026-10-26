const { crearApp } = require('./app');
const config = require('./config/config');
crearApp().listen(config.puerto, () => console.log(`DressFresh en http://localhost:${config.puerto}`));
