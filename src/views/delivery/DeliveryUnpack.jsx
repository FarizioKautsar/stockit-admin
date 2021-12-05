import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CLabel, CRow, CSelect } from '@coreui/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdArrowRight } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router';
import { unpackDelivery } from 'src/store/actions/deliveryActions';

export default function DeliveryUnpack() {
  const deliveryId = useParams().deliveryId;
  const profile = useSelector(state => state.firebase.profile);
  const dispatch = useDispatch();
  const history = useHistory();

  const firestoreState = useSelector(state => state.firestore);
  const delivery = firestoreState.ordered.deliveries?.[0];
  const packages = firestoreState.data.packages;
  const products = firestoreState.data.products;
  const warehouse = firestoreState.data.warehouses?.[0];
  const shelves = firestoreState.ordered.shelves;

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "deliveries",
          doc: deliveryId,
        }
      ],
      storeAs: "deliveries"
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "warehouses",
          doc: `${delivery?.warehouseIdTo}`,
        }
      ],
      storeAs: "warehouses"
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "warehouses",
          doc: `${delivery?.warehouseIdTo}`,
          subcollections: [
            { collection: "shelves" }
          ],
        }
      ],
      storeAs: "shelves"
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "products",
        }
      ],
      storeAs: "products"
    },
    {
      collectionGroup: "packages",
    }
  ])

  const [selectedPackageId, setSelectedPackageId] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSelectPackage(packId) {
    setSelectedPackageId(packId);
  } 

  const selectedPackage = packages?.[selectedPackageId];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    var items = []
    for (const packId of delivery.packageIds) {
      items.push(...packages[packId].items)
    }
    const itemQtys = items.reduce((a, v) => {
      const itemQty = items.filter(i => i.id === v.id).map(i => i.quantity).reduce((a, b) => a+b)
      return { ...a, [v.id]: itemQty}
    }, {})
    const shelfItemArr = Object.keys(data).map(key => ({ itemId: key, shelfId: data[key] }));
    var shelfItem = []
    for (const shelfId of Array.from(new Set(Object.values(data)))) {
      const itemIds = shelfItemArr.filter(s => s.shelfId === shelfId);
      shelfItem.push({ shelfId, items: itemIds.map(i => ({id: i.itemId, quantity: itemQtys[i.itemId]})) })
    }
    console.log(shelfItem);
    await dispatch(unpackDelivery({...delivery, shelfItem}));
    setIsSubmitting(false);
    history.push("/deliveries");
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard>
        <CCardHeader>
          <h3>Unpack {deliveryId}</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={8}>
              {
                delivery?.packageIds?.map((packId, idx) => {
                  const pack = packages?.[packId];
                  return pack && (
                    <CCard>
                      <CCardBody className="d-flex justify-content-between">
                        <div>
                          <p><strong>{pack.title}</strong></p>
                          <table>
                            {
                              pack.items.slice(0, 3).map(item => (
                                <tr>
                                  <td style={{minWidth: 160, fontWeight: 600}}>{products?.[item.id]?.name}</td> 
                                  <td>x {item.quantity}</td> 
                                </tr>
                              ))
                            }
                          </table>
                          {
                            (pack.items.length - 3 > 0) && (
                              <p>and {pack.items.length - 3} more items</p>
                            )
                          }
                        </div>
                        <CButton 
                          color="primary" 
                          variant="outline"
                          onClick={() => handleSelectPackage(packId)}
                        >
                          <MdArrowRight/>
                        </CButton>
                      </CCardBody>
                    </CCard>
                  )
                })
              }
            </CCol>
            <CCol xs={4}>
              <CForm onSubmit={handleSubmit(onSubmit)}>
                {
                  selectedPackageId && (
                    <div>
                      <h6>
                        {selectedPackage?.title}
                      </h6>
                      {
                        selectedPackage?.items?.map((item, idx) => (
                          <CCard>
                            <CCardBody>
                              <p>{item.id}</p>
                              <p><strong>{products?.[item.id]?.name}</strong></p>
                              <p>x {item.quantity}</p>
                              <div className="d-flex">
                                <CFormGroup>
                                  <CLabel htmlFor={item.id}>Shelf</CLabel>
                                  <CSelect
                                    id={item.id}
                                    value={watch(item.id)}
                                    {...register(item.id)}
                                    innerRef={register(item.id).ref}
                                  >
                                    {shelves?.map((s, idx) => (
                                      <option key={idx} value={s.id}>{s.id}</option>
                                    ))}
                                  </CSelect>
                                </CFormGroup>
                                {/* <div>
                                  <CLabel style={{color: "white"}}>{"h"}</CLabel>
                                  <CButton className="w-100">
                                    Store to Shelf
                                  </CButton>
                                </div> */}
                              </div>
                            </CCardBody>
                          </CCard>
                        ))
                      }
                    </div>
                  )
                }
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <div className="d-flex justify-content-end">
        <CButton
          color="success"
          type="submit"
          disabled={isSubmitting}
        >
          Commit Store
        </CButton>
      </div>
    </CForm>
  )
}
