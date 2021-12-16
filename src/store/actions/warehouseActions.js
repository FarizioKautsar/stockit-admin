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
            warehouseId: warehouseDoc.id,
            items: []
          }
        )
      })

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  }
}

export const createItems = (payload) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    const items = payload.items;
    const warehouseId = payload.warehouseId;

    const shelvesRef = firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("warehouses")
      .doc(warehouseId)
      .collection("shelves")


    for (const item of items) {
      batch.set(
        firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("products")
        .doc(item.id), { name: item.name }
      );
        
      var shelf = await shelvesRef.doc(item.shelfId).get();
      shelf = shelf.data()
      const newItem = { id: item.id, quantity: item.quantity };
      shelf = { ...shelf, items: [...shelf.items ? [...shelf.items, newItem] : [newItem]] }
  
      batch.set(
        shelvesRef.doc(item.shelfId),
        shelf
      )
    }

    await batch.commit()
  }
}