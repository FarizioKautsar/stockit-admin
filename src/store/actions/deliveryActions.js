export const createDelivery = (delivery) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    console.log(delivery);

    delivery.packageIds.forEach(packId => {
      batch.update(
        firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("warehouses")
        .doc(delivery.warehouseIdFrom)
        .collection("packages")
        .doc(`${packId}`), {
          status: "indelivery"
        }
      );
    })

    try {      
      await batch.commit()
      const deliveriesRef = firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("deliveries")
  
      await deliveriesRef.add({ 
        ...delivery,
        status: "ready",
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId,
        createdAt: new Date()
      })
    } catch (err) {
      console.log(err);
    }
  }
} 

export const updateDeliveryStatus = (payload) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    const delivery = payload.delivery;
    const status = payload.status;
    
    console.log(delivery);

    const warehouseFromRef = firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("warehouses")
      .doc(delivery.warehouseIdFrom)

    const warehouseToRef = firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("warehouses")
      .doc(delivery.warehouseIdTo)

      
    try {
      if (status === "arrived") {
        for (const packId of delivery.packageIds) {
          var pack = await warehouseFromRef.collection("packages").doc(packId).get();
          pack = pack.data();
    
          batch.set(
            warehouseToRef
              .collection("packages")
              .doc(packId)
            , { ...pack, status: "ready", warehouseId: delivery.warehouseIdTo }
          )
    
          batch.delete(
            warehouseFromRef
              .collection("packages")
              .doc(packId)
          )
        }
      } else if (status === "indelivery") {
        for (const packId of delivery.packageIds) {
          batch.update(
            warehouseFromRef
              .collection("packages")
              .doc(packId)
            , { status: "indelivery" }
          )
        }
      }
      await batch.commit()
      await firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("deliveries")
        .doc(delivery.id)
        .update({ status })
    } catch (err) {
      console.log(err);
    }
  }
}

export const updateDelivery = (delivery) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("UPATEING")
    const profile = getState().firebase.profile;
    const firestore = getFirestore();

    const deliveriesRef = firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("deliveries")

    try {      
      await deliveriesRef.doc(delivery.id).update({ 
        ...delivery
      })
      dispatch({ type: "UPDATE_DELIVERY", payload: delivery })
    } catch (err) {
      dispatch({ type: "UPDATE_DELIVERY_ERROR", err })
    }
  }
}

export const unpackDelivery = (delivery) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("STARTING UNPACK")
    const profile = getState().firebase.profile;
    const firestore = getFirestore();
    const batch = firestore.batch();

    console.log(delivery);

    const shelfRef = firestore
      .collection("companies")
      .doc(profile.companyId)
      .collection("warehouses")
      .doc(delivery.warehouseIdTo)
      .collection("shelves")

    for (const shelfId of Object.keys(delivery.shelves)) {
      batch.set(shelfRef.doc(shelfId), delivery.shelves[shelfId])
    }

    for (const packId of delivery.packageIds) {
      console.log(packId)
      batch.delete(
        firestore
          .collection("companies")
          .doc(profile.companyId)
          .collection("warehouses")
          .doc(delivery.warehouseIdTo)
          .collection("packages")
          .doc(packId)
      )
    }

    try {
      await batch.commit()
      await firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("deliveries")
        .doc(delivery.id)
        .delete()
      dispatch({ type: "UPDATE_DELIVERY", payload: delivery })
    } catch(err) {
      dispatch({ type: "UPDATE_DELIVERY_ERROR", err })
    }
  }
}