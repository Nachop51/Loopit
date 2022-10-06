import loopit from "../api/loopit";

export const logIn = (userName) => {
  return {
    type: "LOG_IN",
    payload: userName,
  };
};

export const signOut = () => async (dispatch) => {
  await loopit.get("/auth/logout");

  dispatch({ type: "SIGN_OUT" });
};

export const checkUserAuth = () => async (dispatch) => {
  try {
    const response = await loopit.get("/auth/verify");

    const payload = {};
    switch (response.data.status) {
      case "Authorized":
        payload.status = true;
        payload.username = response.data.username;
        break;
      default:
        payload.status = false;
        payload.username = null;
        break;
    }

    dispatch({
      type: "CHECK_USER_AUTH",
      payload,
    });
  } catch (error) {
    dispatch({
      type: "CHECK_USER_AUTH",
      payload: { status: false, username: null },
    });
  }
};