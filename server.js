const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

// Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.delete("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const remainingBookings = bookings.filter(
    (booking) => booking.id !== parseInt(id)
  );
  const deletedBooking = bookings.find(
    (booking) => booking.id === parseInt(id)
  );

  if (remainingBookings.length === bookings.length) {
    return res.status(400).json({
      success: false,
      msg: "It appears that nothing was deleted, make sure the selected id exists...",
    });
  }

  return res.status(200).json({
    success: true,
    remainingBookings,
    deletedBooking,
  });
});

app.get("/bookings/:id", (req, res) => {
  const { id } = req.params;

  const filteredBookings = bookings.filter(
    (booking) => booking.id === parseInt(id)
  );
  if (filteredBookings.length === 0) {
    return res.status(400).json({ success: false, msg: "no matching id..." });
  }
  if (filteredBookings.length > 0) {
    return res.status(200).json({ success: true, bookings: filteredBookings });
  }
});

app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  if (
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res
      .status(404)
      .json({ success: false, msg: "all details must be provided" });
  }
  const updatedBookings = [...bookings];

  updatedBookings.push({
    id: Math.random(),
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  });
  console.log(updatedBookings);

  return res.status(200).json({
    success: true,
    bookings: updatedBookings,
  });
});

app.get("/bookings", (req, res) => {
  res.status(200).json({
    success: true,
    bookings,
  });
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/*", (req, res) => {
  res.status(400).json({
    success: false,
    msg: "Not within my API s reach...",
  });
});

// TODO add your routes and helper functions here

const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
