export const createWarehouse = (warehouse) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    try {      
      const warehouseDoc = await firestore
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

      ([...Array(parseInt(warehouse.shelvesAmount)).keys()]).forEach((n) => {
        batch.set(
          firestore
            .collection("companies")
            .doc(profile.companyId)
            .collection("warehouses")
            .doc(warehouseDoc.id)
            .collection("shelves")
            .doc(warehouse.name + "-" + (n+1)),
          {
            warehouseId: warehouseDoc.id
          }
        )
      })

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  }
}