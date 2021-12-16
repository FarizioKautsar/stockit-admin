export const createDelivery = (delivery) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => Promise.resolve().then(() => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

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

    batch.commit()
    .then(() => {      
      const deliveriesRef = firestore
        .collection("companies")
        .doc(profile.companyId)
        .collection("deliveries")
  
      deliveriesRef.add({ 
        ...delivery,
        status: "indelivery",
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId,
        createdAt: new Date()
      }).then(res => {
        dispatch({ type: "CREATE_DELIVERY", payload: delivery })
      })
      .catch(err => {
        dispatch({ type: "CREATE_DELIVERY_ERROR", err })
      })
    }).catch(err => {
      dispatch({ type: "CREATE_DELIVERY_ERROR", err })
    })
  })
} 

export const updateDeliveryStatus = (delivery) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => Promise.resolve().then(() => {
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    const batch = firestore.batch();

    if (delivery.status === "arrived") {
      delivery.packageIds.forEach(packId => {
        const pack = firestore
          .collection("companies")
          .doc(profile.companyId)
          .collection("warehouses")
          .doc(delivery.warehouseIdFrom)
          .collection("packages")
          .doc(`${packId}`)
          .get()
          .data()

        console.log("PACKAGE", pack);
        batch.set(
          firestore
          .collection("companies")
          .doc(profile.companyId)
          .collection("warehouses")
          .doc(delivery.warehouseIdFrom)
          .collection("packages")
          .doc(`${packId}`), {
            status: delivery.status
          }
        );
      })
    } 
  //   else {
  //     delivery.packageIds.forEach(packId => {
  //       batch.update(
  //         firestore
  //         .collection("companies")
  //         .doc(profile.companyId)
  //         .collection("warehouses")
  //         .doc(delivery.warehouseIdFrom)
  //         .collection("packages")
  //         .doc(`${packId}`), {
  //           status: delivery.status
  //         }
  //       );
  //     })
  //   }

  //   batch.commit()
  //   .then(() => {      
  //     const deliveriesRef = firestore
  //       .collection("companies")
  //       .doc(profile.companyId)
  //       .collection("deliveries")
  
  //     deliveriesRef.doc(delivery.deliveryId).update({ 
  //       status: delivery.status,
  //     }).then(res => {
  //       dispatch({ type: "UPDATE_DELIVERY", payload: delivery })
  //     })
  //     .catch(err => {
  //       dispatch({ type: "UPDATE_DELIVERY_ERROR", err })
  //     })
  //   }).catch(err => {
  //     dispatch({ type: "UPDATE_DELIVERY_ERROR", err })
  //   })
  })
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
      batch.delete(
        firestore
          .collection("companies")
          .doc(profile.companyId)
          .collection("warehouses")
          .doc(delivery.warehouseIdFrom)
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