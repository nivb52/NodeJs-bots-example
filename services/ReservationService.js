/* eslint-disable linebreak-style */
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class ReservationService {
  constructor({ datafile, reservationDuration, numberOfTables }) {
    this.datafile = datafile;
    this.numberOfTables = numberOfTables;
    this.reservationDuration = 60 * 60 * reservationDuration;
  }

  isAvailable(datetime, reservations) {
    const currResStart = datetime;
    const currResEnd = datetime + this.reservationDuration;

    // Find out if the intervals [currResStart, currResEnd] and [start, end] overlap
    const booked = reservations.filter((reservation) => {
      const start = reservation.datetime;
      const end = reservation.datetime + this.reservationDuration;
      return currResStart <= end && start <= currResEnd;
    });

    return this.numberOfTables - booked.length >= 0;
  }

  async getList() {
    return this.getData();
  }

  async tryReservation(datetime, numberOfGuests, customerName) {
    const data = await this.getData() || [];
    if (!this.isAvailable(datetime, data)) {
      return {
        error: 'There are no free tables available at that time.',
      };
    }
    if (numberOfGuests > 4) {
      return {
        error: 'Our tables limit to 4 guests.',
      };
    }
    //  else
    data.unshift({ datetime, numberOfGuests, customerName });
    await writeFile(this.datafile, JSON.stringify(data.sort((a, b) => b.datetime - a.datetime)));
    return {
      success: 'The table was successfully reserved!',
    };
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }
}

module.exports = ReservationService;
