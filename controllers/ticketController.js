const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const Showtime = require('../models/showtimeModel');
module.exports = {
  getTicket : async (req, res) => {
    try {
      const ticket = await Ticket.find();
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },
  getTicketByUserId: async (req, res) => {
    try {
      const ticket = await Ticket.find({user_id: res.user.id});
      if (!ticket) return res.status(404).json({msg: "Data not found"});
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },
  refundTicket: async (req, res) => {
    const { ticket_id } = req.body;
    try {
      const ticket = await Ticket.findOne({user_id: res.user.id, _id: ticket_id});
      const user = await User.findById(res.user.id);
      const transaction = await Transaction.findById(ticket.transaction_id);
      if (!ticket || !user || !transaction) return res.status(404).json({message: "Data not found"});
      if (ticket.status === "Refunded") return res.status(400).json({message: "Ticket already refunded"});
      const totalCost = transaction.total;
      user.balance += totalCost;
      await user.save();
      for (const seat of ticket.booking_seat) {
        await Showtime.updateOne({ _id: ticket.showtime._id }, { $set: { [`seats.${seat}`]: false}});
      }
      await Ticket.findOneAndUpdate({_id: ticket_id}, {status: "Refunded"});
      res.status(200).json({message: "Refund success"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}