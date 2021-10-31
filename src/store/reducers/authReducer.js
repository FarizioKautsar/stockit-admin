const initState = {

}

const authReducer = (state = initState, action) => {
  switch(action.type) {
    case "LOGIN_ERROR":
      console.log("LOGIN ERROR");
      return { 
        ...state, 
        authError: "Login Error" 
      }
    case "LOGIN_SUCCESS":
      console.log("LOGIN SUCCESS");
      return {
        ...state,
        authError: null
      }
    case "LOGOUT_ERROR":
      console.log("LOGOUT ERROR");
      return { 
        ...state, 
        authError: "Logout Error" 
      }
    case "LOGOUT_SUCCESS":
      console.log("LOGOUT SUCCESS");
      return {
        ...state,
        authError: null
      }
    case "SIGNUP_ERROR":
      console.log("SIGNUP ERROR");
      return { 
        ...state, 
        authError: "SIGNUP ERROR" 
      }
    case "SIGNUP_SUCCESS":
      console.log("SIGNUP SUCCESS");
      return {
        ...state,
        authError: null
      }
    default:
      return state;
  }
}

export default authReducer;