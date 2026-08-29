const sendRequest = require("../services/connections/sendRequest.connection");
const acceptRequest = require("../services/connections/acceptRequest.connection");
const rejectRequest = require("../services/connections/rejectRequest.connection");

const send = async (req, res) => {
  try {
    const result = await sendRequest(req.user.id, req.params.receiverId);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const accept = async (req, res) => {
  try {
    const result = await acceptRequest(req.user.id, req.params.connectionId);
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const reject = async (req, res) => {
  try {
    const result = await rejectRequest(req.user.id, req.params.connectionId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
module.exports = { send, accept , reject };
