const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const req = require("express/lib/request");

main().catch((err) => console.log(err));

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/unstop");
  await mongoose.connect("mongodb+srv://pranjal:D182D6Evfz7hh36G@atlascluster.qxytknd.mongodb.net/?retryWrites=true&w=majority");

  // await mongoose.connect("mongodb+srv://atlascluster.qxytknd.mongodb.net/test");

  
  console.log("db connected");
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const availableSeatSchema = new mongoose.Schema({
  index: Number,
  value: Number,
});

const bookedSeatSchema = new mongoose.Schema({
  value: String,
});

const AvailableSeat = mongoose.model("AvailableSeat", availableSeatSchema);
const BookedSeat = mongoose.model("BookedSeat", bookedSeatSchema);

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.get("/getAvailableSeats", async (req, res) => {
  const availableSeats = await AvailableSeat.find({});
  res.json(availableSeats);
});

app.get("/getBookedSeats", async (req, res) => {
  const bookedSeats = await BookedSeat.find({});
  res.json(bookedSeats);
});

app.delete("/emptyBookedSeats", async (req, res) => {
  const response = await BookedSeat.deleteMany({});
  res.json(response);
});

app.post("/resetAvailableSeats", async (req, res) => {
  let availableSeat = new AvailableSeat();
  let update;

  for (let i = 0; i < 12; i++) {
    if (i !== 11) {
      update = await availableSeat.updateOne(
        { index: i },
        { $set: { value: 7 } }
      );
    } else {
      update = await availableSeat.updateOne(
        { index: i },
        { $set: { value: 3 } }
      );
    }
  }
  console.log(update);
  res.json(update);
});

app.post("/insertBookedSeats", async (req, res) => {
  let bookedSeat = new BookedSeat();
  console.log(req);
  bookedSeat.value = req.body.value;
  const doc = await bookedSeat.save();
  console.log(doc);
  res.json(doc);
});

app.post("/insertAvailableSeats", async (req, res) => {
  let availableSeat = new AvailableSeat();
  console.log(req);

  availableSeat.index = req.body.index;
  availableSeat.value = req.body.value;

  const doc = await availableSeat.save();
  console.log(doc);
  res.json(doc);
});

app.delete("/emptyAvailableSeats", async (req, res) => {
  const response = await AvailableSeat.deleteMany({});
  res.json(response);
});

app.listen(port, () => {
  console.log("server started");
});
