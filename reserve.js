const { User, Seat, Reservedseat } = require('./models/bus');
const cookieParser = require('cookie-parser');


function reserve(req, res) {
  Seat.findOne({ availability: 'yes' }, 'seatnumber')
    .then(seat => {

      // read cookie - move this to reserve & reset later
      const cookieValue = req.cookies.email;
      console.log('Cookie Value inside Reserve for email:', cookieValue);
      const tokValue = req.cookies.token;
      console.log('Cookie Value inside Reserve for token:', tokValue);

      //res.send('Cookie Read!');
      
      if (seat) {
        Seat.updateOne({ _id: seat._id }, { $set: { availability: "no" } })
          .then((result) => {
            console.log(`Updated ${result.nModified} documents`);
            // Handle the result
          })
          .catch((error) => {
            console.error('Error updating documents:', error);
            // Handle the error
          });
            
        const reservedseat = new Reservedseat({
          email: req.cookies.email,
          seatnumber: seat.seatnumber,
        });
        reservedseat.save()
          .then(result => {
            console.log('Reserved seat saved successfully:', result);
          })
          .catch(err => {
            console.error('Error saving reserved seat:', err);
            // Handle the error as needed
          });
        res.cookie('cseatnumber', seat.seatnumber, {maxAge: 360000});
        return seat.seatnumber;
      }
    })
    .catch((error) => {
      console.error('Error finding seat:', error);
      // Handle the error as needed
    });
}

module.exports = reserve;
