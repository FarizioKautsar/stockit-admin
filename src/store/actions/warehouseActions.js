export const createWarehouse = (warehouse) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => Promise.resolve().then(() => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("warehouses")
      .add({
        ...warehouse,
        createdAt: new Date(),
        location: new firestore.GeoPoint(
          warehouse.location.lat, 
          warehouse.location.lng
        )
      })
        .then(res => {
          console.log(res.id);
          ([...Array(parseInt(warehouse.shelvesAmount)).keys()]).forEach((n) => {
            console.log(n);
            batch.set(
              firestore
                .collection("companies")
                .doc(profile.companyId)
                .collection("warehouses")
                .doc(res.id)
                .collection("shelves")
                .doc(warehouse.name + "-" + (n+1)),
              {
                warehouseId: res.id
              }
            )
          })

          batch.commit()
            .then(() => {
              dispatch({ type: "CREATE_WAREHOUSE", payload: warehouse })
            })
        })
        .catch(err => {
          dispatch({ type: "CREATE_WAREHOUSE_ERROR", err })
        })
  })
}