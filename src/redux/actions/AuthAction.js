export const LoginAction = (userdata) => {
    return {
      type: "LOGIN",
      payload: userdata,
    };
};

export const logoutAction = () => {
  return {
      type: "LOGOUT"
  }
};