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

    
    batch.commit()
    .then(() => {
      const packagesRef = firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("warehouses")
        .doc(pack.warehouseId)
        .collection("packages")
      
      const packageId = packagesRef.doc().id;

      packagesRef
        .doc(packageId).set({
          ...pack,
          packageId,
          companyId: profile.companyId,
          items: pack.items.map(item => ({ id: item.id, quantity: parseInt(item.quantity) })),
          xDim: parseInt(pack.xDim),
          yDim: parseInt(pack.yDim),
          zDim: parseInt(pack.zDim),
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