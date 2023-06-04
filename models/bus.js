const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const seatSchema = new Schema({
  availability: {
    type: String,
    required: true,
  },
  seatnumber: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const reservedseatSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  seatnumber: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Seat = mongoose.model('Seat', seatSchema);
const Reservedseat = mongoose.model('Reservedseat', reservedseatSchema);

module.exports = {
  User,
  Seat,
  Reservedseat,
};
