export const LoginAction = (userdata) => {
    return {
      type: "LOGIN",
      payload: userdata,
    };
};

export const logoutAction = (userdata) => {
  return {
      type: "LOGOUT",
      payload: userdata,
  }
};