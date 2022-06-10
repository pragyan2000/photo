const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
const router = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8080;
var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:1234@cluster0.bkx1w.mongodb.net/?retryWrites=true&w=majority");

const con = mongoose.connection;
con.once("open", () => {
  console.log("connected sucessfully");
});

// model
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  id: { type: String, required: true },
  image: { type: String },
});

const Photo = mongoose.model("Photo", photoSchema);
//

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/insertData", upload.single("photoImage"), (req, res) => {
  console.log(req.file.path);
  const newPhoto = new Photo({
    id: req.body.id,
    image: req.file.path,
  });
  newPhoto
    .save()
    .then(() => res.json("sucessfullty saved"))
    .catch((err) => console.log("error" + err));
});

app.get("/", (req, res) => {
  console.log("hello");
  Photo.find()
    .then((article) => res.json(article))
    .catch((err) => res.status(400).res.json(`error:${err}`));
});
app.get("/uploads/id", (req, res) => {
  Photo.find()
    .then((article) => res.json(article))
    .catch((err) => res.status(400).res.json(`error:${err}`));
});

//listening to the port
app.listen(port, (req, res) => {
  console.log("running at port 3001");
});
