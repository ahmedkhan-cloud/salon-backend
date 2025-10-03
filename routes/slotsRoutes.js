const slotsHandler = require("../handlers/slotsHandler");

module.exports = [
  {
    method: "GET",
    path: "/api/slots/{date}",
    handler: slotsHandler.getSlots,
  },
  {
    method: "POST",
    path: "/api/slots",
    handler: slotsHandler.createSlots,
  },
  {
    method: "GET",
    path: "/api/slots/user",
    handler: slotsHandler.getUserSpecificSlot,
  },
  {
    method: "GET",
    path: "/api/slots/current-slot/{date}/{time}",
    handler: slotsHandler.getCurrentSlot,
  },
  {
    method: "GET",
    path: "/api/slots/recently-booked",
    handler: slotsHandler.getRecentSlots,
  },
  {
    method: "GET",
    path: "/api/slots/today/{date}",
    handler: slotsHandler.getTodaysSlots,
  },
  {
    method: "GET",
    path: "/api/slots/recently-ended/{date}/{time}",
    handler: slotsHandler.getRecentlyEndedSlot,
  },
  {
    method: "GET",
    path: "/api/slots/all-slots",
    handler: slotsHandler.getAllSlots,
  },
  {
    method: "PUT",
    path: "/api/slots/{id}",
    handler: slotsHandler.updateSpecificSlot,
  },
  {
    method: "DELETE",
    path: "/api/slots/{id}",
    handler: slotsHandler.deleteSlot,
  },
];
