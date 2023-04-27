// Cross Origin Resource Sharing
const allowedOrigin = [
  "https://companydb.onrender.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = { corsOptions, allowedOrigin };
