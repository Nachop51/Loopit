const User = require("../models/users");
const Loop = require("../models/loops");
const Save = require("../models/saves");
const Follower = require("../models/followers");
const Like = require("../models/likes");
const { sequelize } = require("../database/db");

const me = async (req, res) => {
  if (!req.id) {
    return res.status(301).json({
      status: "error",
      error: "Bad Request - Missing data",
    });
  }
  try {
    const user_id = req.id;
    const user = await User.findByPk(user_id, {
      attributes: ["email", "full_name"],
    });
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    const countLoops = await Loop.count({
      where: { user_id: user_id },
    });
    const countSaves = await Save.count({
      where: { user_id: user_id },
    });
    const countFollowings = await Follower.count({
      where: { user_id: user_id },
    });
    const countFollowers = await Follower.count({
      where: { follow_id: user_id },
    });
    res.status(200).json({
      status: "OK",
      me: {
        data: user,
        loops: countLoops,
        saves: countSaves,
        following: countFollowings,
        followers: countFollowers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error,
    });
  }
};

const getUsers = async (req, res) => {
  let { username, limit, page } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  let dicUsername = {};
  if (!page) page = 1;
  if (!limit) limit = 10;
  if (username) {
    dicUsername = {
      limit: limit,
      offset: page * limit - limit,
      where: {
        username: username,
      },
      attributes: ["id", "username", "email", "full_name"],
    };
  } else {
    dicUsername = {
      limit: limit,
      offset: page * limit - limit,
      attributes: ["id", "username", "email", "full_name"],
    };
  }
  try {
    const users = await User.findAll(dicUsername);
    if (!users) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    delete dicUsername.limit;
    delete dicUsername.offset;
    delete dicUsername.attributes;
    const countUsername = await User.count(dicUsername);
    const totalPages = Math.ceil(countUsername / limit);
    res.status(200).json({
      status: "OK",
      pages: {
        now: page,
        total: totalPages,
      },
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error,
    });
  }
};

const updateUser = async (req, res) => {
  const id = req.id;
  if (!id) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - missing data",
    });
  }
  try {
    const { full_name, email, username, theme, editorTheme } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        Error: "Bad Request - User does not exist",
      });
    }
    if (full_name) {
      user.full_name = full_name;
    }
    if (email) {
      const emailExist = await User.findOne({
        where: { email: email },
      });
      if (emailExist) {
        return res.status(400).json({
          status: "Error",
          error: "Bad Request - email already exist",
        });
      }
      user.email = email;
    }
    if (username) {
      const userExist = await User.findOne({
        where: { username: username },
      });
      if (userExist) {
        return res.status(400).json({
          status: "Error",
          error: "Bad Request - Username already exist",
        });
      }
      user.username = username;
    }
    if (theme) {
      user.theme = theme;
    }
    if (editorTheme) {
      user.editorTheme = editorTheme;
    }
    await user.save();
    res.status(200).json({
      status: "OK",
      user: "User updated",
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      Error: error,
    });
  }
};

const getUserByusername = async (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - Missing data",
    });
  }
  try {
    const user = await User.findOne({
      where: { username: username },
      attributes: ["id", "username", "email", "full_name"],
    });
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    const countSave = await Save.count({
      where: { user_id: user.id },
    });
    const countLoop = await Loop.count({
      where: { user_id: user.id },
    });
    const following = await Follower.count({
      where: { user_id: user.id },
    });
    const followers = await Follower.count({
      where: { follow_id: user.id },
    });
    const ifFollow = await Follower.findOne({
      where: { user_id: req.id, follow_id: user.id },
    });
    res.status(200).json({
      status: "OK",
      user: {
        personal_info: user,
        loops: countLoop,
        saves: countSave,
        following: following,
        followers: followers,
        follow: ifFollow ? true : false,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: error,
    });
  }
};

const getSaveUser = async (req, res) => {
  let { limit, page } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (!page) page = 1;
  if (!limit) limit = 10;
  console.log(page, limit);
  try {
    const id_user = req.id;
    const data = await sequelize.query(
      "SELECT Saves.loop_id, Loops.name, Loops.description, Loops.content, Loops.filename, Users.username, Loops.created_at, Loops.updated_at, Languages.name as language_name, Loops.count_likes, count_comments, count_saves FROM Saves JOIN Loops ON Saves.loop_id = Loops.id JOIN Users ON Loops.user_id = Users.id JOIN Languages ON Languages.id = Loops.language_id WHERE Saves.user_id = ? ORDER BY Loops.created_at DESC LIMIT ? OFFSET ?;",
      {
        replacements: [id_user, limit, page * limit - limit],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!data) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - No loops saved by the user yet",
      });
    }
    const listloops = [];
    for (let i of data) {
      const loop = {
        id: i.loop_id,
        name: i.name,
        description: i.description,
        content: i.content,
        filename: i.filename,
        count_likes: i.count_likes,
        count_comments: i.count_comments,
        count_saves: i.count_saves,
        created_at: i.created_at,
        user: {
          username: i.username,
        },
        language: {
          name: i.language_name,
        },
      };
      listloops.push(loop);
    }
    const user_id = req.id;
    const likesUser = await Like.findAll({
      where: { user_id: user_id },
      attributes: ["loop_id"],
    });
    const savesUser = await Save.findAll({
      where: { user_id: user_id },
      attributes: ["loop_id"],
    });
    //this part check if the user has liked or saved the loop
    listloops.forEach((loop) => {
      loop.like = false;
      loop.save = false;
      for (let a = 0; a < likesUser.length; a++) {
        if (loop.id === likesUser[a].loop_id) {
          loop.like = true;
          break;
        } else {
          loop.like = false;
        }
      }
      for (let a = 0; a < savesUser.length; a++) {
        if (loop.id === savesUser[a].loop_id) {
          loop.save = true;
          break;
        } else {
          loop.save = false;
        }
      }
    });
    const countSaves = await Save.count({
      where: { user_id: id_user },
    });
    const totalPages = Math.ceil(countSaves / limit);
    return res.status(200).json({
      status: "OK",
      pages: {
        now: page,
        total: totalPages,
      },
      loops: listloops,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const getFollowingsByUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - Missing data",
    });
  }
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    const data = await sequelize.query(
      "SELECT Users.id, Users.username  FROM Followers JOIN Users ON Followers.follow_id = Users.id WHERE Followers.user_id = ?;",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!data) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - followers empty",
      });
    }
    return res.status(200).json({
      status: "OK",
      followings: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const getFollowersByUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "Error",
      error: "Bad Request - Missing data",
    });
  }
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    const data = await sequelize.query(
      "SELECT Users.id, Users.username FROM Followers JOIN Users ON Followers.user_id = Users.id WHERE Followers.follow_id = ?;",
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!data) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - following empty",
      });
    }
    res.status(200).json({
      status: "OK",
      followers: data,
    });
  } catch (error) {}
};

const getLikesByUser = async (req, res) => {
  let { limit, page } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (!page) page = 1;
  if (!limit) limit = 10;
  try {
    const id_user = req.id;
    const data = await sequelize.query(
      "SELECT Loops.id, Loops.name, Loops.description, Loops.content, Loops.filename, Users.username, Loops.created_at, Loops.updated_at, Languages.name as language_name FROM Likes JOIN Loops ON Likes.loop_id = Loops.id JOIN Users ON Loops.user_id = Users.id JOIN Languages ON Languages.id = Loops.language_id WHERE Likes.user_id = ?;",
      {
        limit: limit,
        offset: page * limit - limit,
        replacements: [id_user],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!data) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - No loops liked by the user yet",
      });
    }
    const countLikes = await Like.count({
      where: { user_id: id_user },
    });
    const totalPages = Math.ceil(countLikes / limit);
    const listloops = [];
    for (let i of data) {
      const loop = {
        id: i.loop_id,
        name: i.name,
        description: i.description,
        content: i.content,
        filename: i.filename,
        created_at: i.created_at,
        user: {
          username: i.username,
        },
        language: {
          name: i.language_name,
        },
      };
      listloops.push(loop);
    }
    res.status(200).json({
      status: "OK",
      pages: {
        now: page,
        total: totalPages,
      },
      loops: listloops,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const changeThemeMode = async (req, res) => {
  try {
    const user = await User.findByPk(req.id);
    if (!user) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - User does not exist",
      });
    }
    console.log(user.dataValues.theme);
    if (user.theme === "light") {
      user.theme = "dark";
    } else {
      user.theme = "light";
    }
    await user.save();
    res.status(200).json({
      status: "OK",
      theme_mode: user.theme,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const usersStats = async (req, res) => {
  try {
    let dicStatsCreate = {};
    let dicStatsLiked = {};
    let dicStatsSaved = {};
    const user_id = req.id;
    const statsCreated = await sequelize.query(
      "Select Languages.name, count(*) as cantidad FROM Loops JOIN Languages ON Loops.language_id = Languages.id WHERE Loops.user_id = ? GROUP BY Languages.name;",
      {
        replacements: [user_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const totalLoops = await Loop.count({
      where: { user_id: user_id },
    });
    statsCreated.forEach((language) => {
      const porcentaje = (language.cantidad / totalLoops) * 100;
      dicStatsCreate[language.name] = parseFloat(porcentaje.toFixed(2));
    });

    const statsLiked = await sequelize.query(
      "Select Languages.name, count(*) as cantidad FROM Likes JOIN Loops ON Likes.loop_id = Loops.id JOIN Languages ON Loops.language_id = Languages.id WHERE Likes.user_id = ? GROUP BY Languages.name;",
      {
        replacements: [user_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const totalLiked = await Like.count({
      where: { user_id: user_id },
    });
    statsLiked.forEach((language) => {
      const porcentaje = (language.cantidad / totalLiked) * 100;
      dicStatsLiked[language.name] = parseFloat(porcentaje.toFixed(2));
    });

    const statsSaved = await sequelize.query(
      "Select Languages.name, count(*) as cantidad FROM Saves JOIN Loops ON Saves.loop_id = Loops.id JOIN Languages ON Loops.language_id = Languages.id WHERE Saves.user_id = ? GROUP BY Languages.name;",
      {
        replacements: [user_id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const totalSaved = await Save.count({
      where: { user_id: user_id },
    });
    statsSaved.forEach((language) => {
      const porcentaje = (language.cantidad / totalSaved) * 100;
      dicStatsSaved[language.name] = parseFloat(porcentaje.toFixed(2));
    });

    res.status(200).json({
      status: "OK",
      created: dicStatsCreate,
      Liked: dicStatsLiked,
      Saved: dicStatsSaved,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

const loopsUsersFollowing = async (req, res) => {
  let { limit, page } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (!page) page = 1;
  if (!limit) limit = 10;
  try {
    const loops = await sequelize.query(
      "SELECT Loops.id, Loops.name, Loops.description, Loops.content, Loops.filename, Users.username, Loops.created_at, Loops.updated_at, Languages.name as Language FROM Followers JOIN Users ON User.id = Users.id JOIN JOIN Loops ON Loops.user_id = Followers.follow_id JOIN Languages ON Languages.id = Loops.language_id WHERE Followers.user_id = ?;",
      {
        replacements: [req.id],
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!loops) {
      return res.status(400).json({
        status: "Error",
        error: "Bad Request - No loops liked by the user yet",
      });
    }
    const countLoops = await Loop.count({
      where: { user_id: req.id },
    });
    const totalPages = Math.ceil(countLoops / limit);
    const listloops = [];
    for (let i of loops) {
      const loop = {
        id: i.id,
        name: i.name,
        description: i.description,
        content: i.content,
        filename: i.filename,
        created_at: i.created_at,
        user: {
          username: i.username,
        },
        language: {
          name: i.language_name,
        },
      };
      listloops.push(loop);
    }
    res.status(200).json({
      status: "OK",
      pages: {
        now: page,
        total: totalPages,
      },
      loops: listloops,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      error: error,
    });
  }
};

// Here we export the module, in order to use it in routes/routeUser
module.exports = {
  me: me,
  updateUser: updateUser,
  getUsers: getUsers,
  getSaveUser: getSaveUser,
  getUserByusername: getUserByusername,
  getFollowersByUser: getFollowersByUser,
  getLikesByUser: getLikesByUser,
  changeThemeMode: changeThemeMode,
  usersStats: usersStats,
  loopsUsersFollowing: loopsUsersFollowing,
  getFollowingsByUser: getFollowingsByUser,
};
