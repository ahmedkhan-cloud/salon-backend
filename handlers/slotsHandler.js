const Slots = require("../models/slotModel");
const User = require("../models/userModel");

module.exports = {
  getSlots: async (request, h) => {
    try {
      const date = request.params.date;
      const slotOfThisDate = await Slots.find({ date: date }).select(
        "startTime -_id"
      );
      if (!slotOfThisDate) {
        return h.response({
          status: "not found",
          message: "All slots are available",
        });
      }

      return h
        .response({
          status: "success",
          message: "There are slots for the date",
          slotOnSelectDate: slotOfThisDate,
        })
        .code(200);
    } catch (err) {
      console.log("An Error occured while getting slots info: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  createSlots: async (request, h) => {
    try {
      const bookedBy = request.auth.credentials.userId;
      const slot = Slots({ ...request.payload, bookedBy: bookedBy });

      await slot.save();

      const slotsByUser = await Slots.find({ bookedBy: bookedBy });

      await User.findOneAndUpdate(
        { _id: bookedBy },
        { $set: { slotsBooked: slotsByUser } }
      );
      return h
        .response({
          status: "success",
          message: "Slot created Successfully",
        })
        .code(201);
    } catch (err) {
      console.log("An Error occured while creating slots: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  getUserSpecificSlot: async (request, h) => {
    try {
      const id = request.auth.credentials.userId;
      const slotsByUser = await User.find({ _id: id })
        .select("slotsBooked _id").sort({startTime: -1})
        .populate("slotsBooked", "-bookedBy -__v");
      return h
        .response({
          status: "success",
          message: "Slots booked by user",
          userSlots: slotsByUser,
        })
        .code(200);
    } catch (err) {
      console.log("An Error occured while getting slots info: ", err.message);
      return h.response({ status: "server", message: err.message }).code(500);
    }
  },
  getCurrentSlot: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const { date, time } = request.params;
        const hour = time.split(":")[0];
        const minutes = time.split(":")[1] >= 30 ? "30" : "00";
        const currentSlot = await Slots.findOne({
          date: date,
          startTime: `${hour}:${minutes}`,
        }).populate("bookedBy");

        return h
          .response({
            status: "success",
            message: "OnGoing Slot",
            slot: currentSlot,
          })
          .code(200);
      } catch (err) {
        console.log(
          "An Error occured while getting current slot info: ",
          err.message
        );
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  getRecentSlots: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const recentSlots = await Slots.find()
          .populate("bookedBy")
          .sort({ createdAt: -1 })
          .limit(10);
        return h
          .response({
            status: "success",
            message: "OnGoing Slot",
            slots: recentSlots,
          })
          .code(200);
      } catch (err) {
        console.log(
          "An Error occured while getting current slot info: ",
          err.message
        );
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  getTodaysSlots: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const date = request.params.date;
        const slotOfThisDate = await Slots.find({ date: date }).sort({startTime: 1}).populate(
          "bookedBy"
        );
        if (!slotOfThisDate) {
          return h.response({
            status: "not found",
            message: "No Slots booked for Today",
          });
        }

        return h
          .response({
            status: "success",
            message: "Here are slots for the date",
            slotOnSelectDate: slotOfThisDate,
          })
          .code(200);
      } catch (err) {
        console.log("An Error occured while getting slots info: ", err.message);
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  getRecentlyEndedSlot: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const { date, time } = request.params;
        const hour = time.split(":")[0];
        const minutes = time.split(":")[1] >= 30 ? "30" : "00";
        const endedSlot = await Slots.find({
          date: date,
          startTime: { $lt: `${hour}:${minutes}` },
        }).limit(5).sort({startTime: -1}).populate("bookedBy");
        return h
          .response({
            status: "success",
            message: "OnGoing Slot",
            recentlyEnded: endedSlot,
          })
          .code(200);
      } catch (err) {
        console.log(
          "An Error occured while getting current slot info: ",
          err.message
        );
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  getAllSlots: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const allSlots = await Slots.find()
          .populate("bookedBy")
          .sort({ createdAt: -1 });

        return h
          .response({
            status: "success",
            slots: allSlots,
          })
          .code(200);
      } catch (err) {
        console.log(
          "An Error occured while getting all slot info: ",
          err.message
        );
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  updateSpecificSlot: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const id = request.params.id;
        const slotInfo = request.payload;

        await Slots.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              date: slotInfo.date,
              startTime: slotInfo.startTime,
              serviceRequired: slotInfo.serviceRequired,
            },
          }
        );

        return h
          .response({
            status: "success",
            message: "Slot Updated Successfully",
          })
          .code(200);
      } catch (err) {
        console.log("An Error occured while updating slot info: ", err.message);
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
  deleteSlot: async (request, h) => {
    if (request.auth.credentials.role === "admin") {
      try {
        const id = request.params.id;

        await Slots.findOneAndDelete({ _id: id });

        return h
          .response({
            status: "success",
            message: "Slot Delet Successfully",
          })
          .code(200);
      } catch (err) {
        console.log("An Error occured while updating slot info: ", err.message);
        return h.response({ status: "server", message: err.message }).code(500);
      }
    } else {
      console.log("You don't have access to this data");
      return h.response({ status: "authorization failed" }).code(401);
    }
  },
};
