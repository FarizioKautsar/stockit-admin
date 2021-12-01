export const createPackage = (pack) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => Promise.resolve().then(() => {
    const firestore = getFirestore();
    const batch = firestore.batch();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    pack.items.forEach((item) => {
      batch.set(
        firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("products")
        .doc(item.id), { name: item.name }
      );
    });

    pack.items = pack.items.map(item => ({ id: item.id, quantity: parseInt(item.quantity) }));
    pack.xDim = parseInt(pack.xDim);
    pack.yDim = parseInt(pack.yDim);
    pack.zDim = parseInt(pack.zDim);

    batch.commit()
      .then(() => {
        firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("warehouses")
        .doc(pack.warehouseId)
        .collection("packages")
        .add({ 
          ...pack,
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId,
          createdAt: new Date()
        }).then(res => {
          dispatch({ type: "CREATE_PACKAGE", payload: pack })
        }).catch(err => {
          dispatch({ type: "CREATE_PACKAGE_ERROR", err })
        })
      })
      .catch(err => {
        dispatch({ type: "CREATE_PACKAGE_ERROR", err })
      })
  }) 
} 