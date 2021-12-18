export const signIn = (credentials) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    firebase.login({
      email: credentials.email,
      password: credentials.password
    }).then(() => {
      dispatch({ type: "LOGIN_SUCCESS" });
    }).catch(err => {
      dispatch({ type: "LOGIN_ERROR", err });
    })
  }
}

export const signOut = () => {
  return async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    await firebase.logout()
      .then(() => {
        dispatch({ type: "LOGOUT_SUCCESS" })
      })
      .catch(err => {
        dispatch({ type: "LOGOUT_ERROR", err })
      })
  }
}

export const signUp = (newUser) => {
  return async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const profile = getState().firebase.profile;

    firebase.createUser({
      email: newUser.email, 
      password: newUser.password,
      username: newUser.username,
    }, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: newUser.roleId,
      company: profile.companyId
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
  }
}