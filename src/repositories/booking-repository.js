const CrudRepository = require("./crud-repository");
const { bookings } = require("../models");

class BookingRepository extends CrudRepository {
  constructor() {
    super(bookings);
  }
}

module.exports = BookingRepository;
