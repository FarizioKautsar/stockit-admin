export const createPackage = (packages) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore.collection('packages').add({ 
      ...packages,
      authorFirstName: "Farizio",
      authorLastName: "Kautsar",
      authorId: 12345,
      createdAt: new Date()
    }).then(res => {
      dispatch({ type: "CREATE_PACKAGE", payload: packages })
    }).catch(err => {
      dispatch({ type: "CREATE_PACKAGE_ERROR", err })
    })
  }
}

export const getPackages = (packages) => {
  return (dispatch, getState, { firebase, firestore }) => {
    dispatch({ type: "GET_PACKAGES", payload: packages })
  }
}