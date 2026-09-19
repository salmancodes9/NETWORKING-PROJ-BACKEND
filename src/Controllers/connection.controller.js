const db = require("../Models");
const { Op } = db.Sequelize;

// Helper: get the logged-in user's MemberProfile
const getMemberProfile = async (userId) => {
  const profile = await db.Profile.findOne({ where: { userId } });
  if (!profile) throw new Error("Profile not found");
  const memberProfile = await db.MemberProfile.findOne({ where: { profileId: profile.id } });
  if (!memberProfile) throw new Error("Only members can use connections");
  return memberProfile;
};

const send = async (req, res) => {
  try {
    const myProfile = await getMemberProfile(req.user.id);
    const receiverMemberProfileId = Number(req.params.receiverId);

    if (myProfile.profileId === receiverMemberProfileId) {
      return res.status(400).json({ message: "You cannot send a connection request to yourself" });
    }

    const existing = await db.Connection.findOne({
      where: {
        [Op.or]: [
          { requesterMemberProfileId: myProfile.profileId, receiverMemberProfileId },
          { requesterMemberProfileId: receiverMemberProfileId, receiverMemberProfileId: myProfile.profileId },
        ],
      },
    });

    if (existing) {
      if (existing.status === "accepted") return res.status(400).json({ message: "Already connected" });
      if (existing.status === "pending") return res.status(400).json({ message: "A connection request already exists" });
    }

    const connection = await db.Connection.create({
      requesterMemberProfileId: myProfile.profileId,
      receiverMemberProfileId,
      status: "pending",
    });

    res.status(201).json({ message: "Connection request sent", connection });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const accept = async (req, res) => {
  try {
    const myProfile = await getMemberProfile(req.user.id);
    const connectionId = req.params.connectionId;

    const connection = await db.Connection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection request not found" });
    if (connection.receiverMemberProfileId !== myProfile.profileId) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await connection.update({ status: "accepted" });
    res.status(200).json({ message: "Connection accepted", connection });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const reject = async (req, res) => {
  try {
    const myProfile = await getMemberProfile(req.user.id);
    const connectionId = req.params.connectionId;

    const connection = await db.Connection.findByPk(connectionId);
    if (!connection) return res.status(404).json({ message: "Connection request not found" });
    if (connection.receiverMemberProfileId !== myProfile.profileId) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await connection.update({ status: "rejected" });
    res.status(200).json({ message: "Connection rejected", connection });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const myProfile = await getMemberProfile(req.user.id);

    const connections = await db.Connection.findAll({
      where: {
        status: "accepted",
        [Op.or]: [
          { requesterMemberProfileId: myProfile.profileId },
          { receiverMemberProfileId: myProfile.profileId },
        ],
      },
      include: [
        { model: db.MemberProfile, as: "requester", attributes: ["profileId", "name"] },
        { model: db.MemberProfile, as: "receiver", attributes: ["profileId", "name"] },
      ],
    });

    const otherMembers = connections.map((conn) => {
      const isRequester = conn.requesterMemberProfileId === myProfile.profileId;
      return isRequester ? conn.receiver : conn.requester;
    });

    res.status(200).json(otherMembers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const myProfile = await getMemberProfile(req.user.id);

    const pending = await db.Connection.findAll({
      where: {
        status: "pending",
        receiverMemberProfileId: myProfile.profileId,
      },
      include: [
        { model: db.MemberProfile, as: "requester", attributes: ["profileId", "name"] },
      ],
    });

    res.status(200).json(pending);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { send, accept, reject, getConnections, getPendingRequests };