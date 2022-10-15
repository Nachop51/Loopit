import PropTypes from "prop-types";

const User = ({ username }) => {
  return (
    <div className="user-info">
      <div className="avatar">
        <img
          src="https://i.pravatar.cc/300"
          className="avatar-img"
          alt="user-profile"
        />
      </div>
      <div>
        <h3>{username}</h3>
        <span>{new Date().toUTCString()}</span>
      </div>
    </div>
  );
};

User.propTypes = {
  username: PropTypes.string.isRequired,
  // image: PropTypes.string.isRequired,
};

export default User;