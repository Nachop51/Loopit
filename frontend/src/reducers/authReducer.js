const INITIAL_STATE = {
  isSignedIn: null,
  id: null,
  username: null,
  theme: "light",
  editorTheme: "vs-dark",
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isSignedIn: true,
        id: action.payload.id,
        username: action.payload.username,
        theme: action.payload.theme,
        editorTheme: action.payload.editorTheme,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignedIn: false,
        id: null,
        username: null,
        theme: "light",
        editorTheme: "vs-dark",
      };
    case "CHECK_USER_AUTH":
      return {
        ...state,
        isSignedIn: action.payload.status,
        id: action.payload.id,
        username: action.payload.username,
        theme: action.payload.theme,
        editorTheme: action.payload.editorTheme,
      };
    case "SWITCH_THEME":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    case "UPDATE_USER":
      return {
        ...state,
        username: action.payload.username,
        theme: action.payload.theme,
        editorTheme: action.payload.editorTheme,
      };
    default:
      return state;
  }
};

export default authReducer;
