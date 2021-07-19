const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const tokenRoute = require("./routes/authtoken");
const categoryRoute = require("./routes/categories");
const shortUrlRoute = require("./routes/shortUrl");
const productRoute = require("./routes/products");
const createOrderRoute = require("./routes/createOrder");
const multer = require("multer");
const path = require("path");

dotenv.config("env",dotenv);
console.log();
app.use(express.json());
// console.log(__dirname)   
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
// mongoose.set('useFindAndModify', true);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/authtoken", tokenRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/shortUrl", shortUrlRoute);
app.use("/api/createOrder", createOrderRoute);

app.use(express.urlencoded({extended: false}))
app.listen("5000", () => {
  console.log("Backend is running.");
});
