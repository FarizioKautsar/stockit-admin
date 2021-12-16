export const createCompany = (payload) => {
  return async (dispatch, getState, {getFirebase, getFirestore}) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const profile = getState().firebase.profile;

    const newUser = payload.user;

    const companiesRef = firestore
      .collection("companies");
    const companyId = companiesRef.doc().id;

    await companiesRef.doc(companyId).set(payload.company)

    firebase.createUser({
      email: newUser.email, 
      password: newUser.password,
      username: newUser.username,
    }, {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: "1",
      companyId: companyId
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err });
    });
  }
}