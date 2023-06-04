const { User, Seat, Reservedseat } = require('./models/bus');

function reset(){
  //update Seat collection
  // Update all documents in the collection
  Seat.updateMany({}, { $set: { availability: "yes" } })
    .then((result) => {
      console.log(`Updated ${result.nModified} documents`);
      // Handle the result
    })
    .catch((error) => {
      console.error('Error updating documents:', error);
      // Handle the error
    });

  //empty Reservedseat collection
  Reservedseat.deleteMany({})
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents`);
      // Handle the result
    })
    .catch((error) => {
      console.error('Error deleting documents:', error);
      // Handle the error
    });

    //empty User collection
    User.deleteMany({})
    .then((result) => {
      console.log(`Deleted ${result.deletedCount} documents`);
      // Handle the result
    })
    .catch((error) => {
      console.error('Error deleting documents:', error);
      // Handle the error
    });
}

module.exports = reset;
