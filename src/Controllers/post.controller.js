const createPost = require("../services/post/createPost.service");
const deletePost = require("../services/post/deletePost.service");
const getAllPosts = require("../services/post/getAllPosts.service");
const getMyPosts = require("../services/post/getMyPosts.service");

const create = async (req, res) => {
  try {
    const post = await createPost(req.user.id, req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deletePost(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getMine = async (req, res) => {
  try {
    const posts = await getMyPosts(req.user.id);
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { create, remove, getAll, getMine };
