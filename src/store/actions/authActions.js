export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
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
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.logout()
      .then(() => {
        dispatch({ type: "LOGOUT_SUCCESS" })
      })
      .catch(err => {
        dispatch({ type: "LOGOUT_ERROR", err })
      })
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase.createUser({
      email: newUser.email, 
      password: newUser.password,
      username: newUser.username,
    }).then(resp => {
      return firestore.collection('users').doc(resp.user.uid).set({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
  }
}