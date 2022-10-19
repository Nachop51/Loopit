const User = require("../models/users");
const Loop = require("../models/loops");
const Like = require("../models/likes");
const jwt = require("jsonwebtoken");
const { key } = require("../config");
const loops = require("./loops");

const addLike = async (req, res) => {
  const { loop_id } = req.body;
  const token = req.cookies.token;
  if (!loop_id) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - missing data",
    });
  }
  try {
    const token_decode = jwt.decode(token, key);
    const user_id = token_decode.userId;
    const user = await User.findByPk(user_id);
    const loop = await Loop.findByPk(loop_id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - user does not exist",
      });
    }
    if (!loop) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - loop does not exist",
      });
    }
    const new_like = await Like.create({
      user_id: user_id,
      loop_id: loop_id,
    });
    if (!new_like) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - like already exists",
      });
    }
    const add_countLike = await Loop.update({ count_likes: loop.count_likes + 1 }, {
      where: {
        id: loop_id,
      }
    });
    res.status(200).json({
      status: "OK",
      data: new_like,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const deleteLike = async (req, res) => {
  const token = req.cookies.token;
  const { loop_id } = req.body;
  if (!loop_id) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - missing data",
    });
  }
  try {
    const token_decode = jwt.decode(token, key);
    const user_id = token_decode.userId;
    const user = await User.findByPk(user_id);
    const like_delete = await Like.findAll({
      where: {
        user_id: user_id,
        loop_id: loop_id,
      },
    });
    if (!like_delete) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - like does not exist",
      });
    }
    const delete_like = await Like.destroy({
      where: {
        user_id: user_id,
        loop_id: loop_id,
      },
    });
    const num_likes = await Loop.findAll({
      attributes: ["count_likes"],
      where: {
        id: loop_id,
      }
    })
    const rest_countLikes = await Loop.update({ count_likes: num_likes - 1 }, {
      where: {
        id: loop_id,
      }
    });
    res.status(200).json({
      status: "OK",
      data: [],
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

module.exports = {
  addLike: addLike,
  deleteLike: deleteLike,
};
