export const createPackage = (payload) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const batch = firestore.batch();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    const pack = payload.pack;

    payload.shelves.forEach((shelf) => {
      batch.update(
        firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("warehouses")
        .doc(payload.pack.warehouseId)
        .collection("shelves")
        .doc(shelf.id), { items: shelf.items || [] }
      );
    });

    try {      
      await batch.commit()
      const packagesRef = firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("warehouses")
        .doc(pack.warehouseId)
        .collection("packages")

        
      const packageId = packagesRef.doc().id;
      console.log(packageId);
        
      await packagesRef
        .doc(packageId).set({
          ...pack,
          packageId,
          companyId: profile.companyId,
          items: pack.items?.map(item => ({ id: item.id, quantity: parseInt(item.quantity) })),
          xDim: parseInt(pack.xDim),
          yDim: parseInt(pack.yDim),
          zDim: parseInt(pack.zDim),
          authorFirstName: profile.firstName,
          authorLastName: profile.lastName,
          authorId,
          createdAt: new Date()
        })

      dispatch({ type: "CREATE_PACKAGE", payload: pack })
    } catch (err) {
      console.log(err);
      dispatch({ type: "CREATE_PACKAGE_ERROR", err })
    }
  }
} 