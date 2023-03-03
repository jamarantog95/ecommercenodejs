const multer = require('multer');

// multer.diskStorage();

//Almacena las imagenes en memoria
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };