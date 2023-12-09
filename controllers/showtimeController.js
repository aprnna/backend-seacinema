const ShowTime = require('../models/showtimeModel');
const Movie = require('../models/movieModel');

module.exports = {
  getAllShowTimes: async (req, res) => {
    try {
      const response = await ShowTime.find();
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({msg: error.message});
    }
  },
  getShowTimeById: async (req, res) => {
    try {
      const showTime = await ShowTime.findById(req.params.id);
      if (!showTime) return res.status(404).json({msg: "Data not found"});
      res.status(200).json(showTime);
    } catch (error) {
      res.status(500).json({msg: error.message});
    }
  },
  getShowTimeByMovieId: async (req, res) => {
    try {
      const showTimes = await ShowTime.find({movie_id: req.params.id});
      if (!showTimes) return res.status(404).json({msg: "Data not found"});
      res.status(200).json(showTimes);
    } catch (error) {
      res.status(500).json({msg: error.message});
    }
  },
  createShowTime: async (req, res) => {
    const { movie_id, date } = req.body;
    const showTime = new ShowTime({
      movie_id: movie_id,
      date: date,
      seats: generateSeats(),
    });
    try {
      await showTime.save();
      res.status(201).json({message: "Showtime created successfuly"});
    } catch (error) {
      res.status(400).json({message: error.message});
    }
  },
  updateShowTime: async (req, res) => {
    const { date } = req.body;
    res.showTime.date = date || res.showTime.date;
    res.showTime.time = time || res.showTime.time;
    try {
      await res.showTime.save();
      res.status(200).json({message: "Showtime updated successfuly"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },
  deleteShowTime: async (req, res) => {
    try {
      await res.showTime.deleteOne();
      res.status(200).json({message: "Showtime deleted successfuly"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}

const generateSeats = () => {
  const seats = {}
  const alphabets = ["A", "B", "C", "D", "E", "F", "G"]
  alphabets.forEach((alphabet) => {
    for (let i = 1; i <= 8; i++) {
      seats[`${alphabet}${i}`] = false;
    }
  });
  return seats;
}