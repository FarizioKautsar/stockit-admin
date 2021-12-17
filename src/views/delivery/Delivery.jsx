import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CLabel, CRow, CSelect } from '@coreui/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { updateDeliveryStatus } from 'src/store/actions/deliveryActions';
import { statusEnum } from 'src/utils/globals';
import { object, string } from 'yup';

export default function Delivery() {
  const deliveryId = useParams().deliveryId;
  const profile = useSelector(state => state.firebase.profile);
  const dispatch = useDispatch();

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
        }
      ],
      storeAs: "warehouses"
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

  const firestoreState = useSelector(state => state.firestore);
  const delivery = firestoreState.ordered.deliveries?.[0];
  const packages = firestoreState.data.packages;
  const products = firestoreState.data.products;
  const warehouses = firestoreState.data.warehouses;

  const formSchema = object().shape({
    status: string().required(),
  });
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  const [isChangingStatus, setIsChangingStatus] = useState(false);

  function handleShowChangeStatus() {
    setIsChangingStatus(!isChangingStatus);
  }

  function onSubmit(data) {
    const payload = { delivery, status: getValues("status") };
    dispatch(updateDeliveryStatus(payload))
      .finally(() => {
        // handleShowChangeStatus()
      })
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <h3>Delivery {deliveryId}</h3>
          <Link to={deliveryId + "/edit"}>
            <CButton
              color="primary"
            >
              Edit Delivery
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={6}>
              <CForm onSubmit={handleSubmit(onSubmit)} className="w-100">
                <CRow>
                  <CCol xs={12}>
                    <h6>Description</h6>
                    <p>{delivery?.description}</p>
                  </CCol>
                  <CCol xs={6}>
                    <h6>From</h6>
                    <p>{warehouses?.[delivery?.warehouseIdFrom]?.name}</p>
                  </CCol>
                  <CCol xs={6}>
                    <h6>To</h6>
                    <p>{warehouses?.[delivery?.warehouseIdTo]?.name}</p>
                  </CCol>
                  <CCol xs={6}>
                    {
                      isChangingStatus ? (
                        <CFormGroup>
                          <CLabel htmlFor="status">Change Status</CLabel>
                          <CSelect
                            id="status"
                            defaultValue={delivery?.status}
                            {...register("status")}
                            innerRef={register("status").ref}
                          >
                            <option value="ready">Ready</option>
                            <option value="indelivery">In Delivery</option>
                            <option value="arrived">Arrived</option>
                          </CSelect>
                        </CFormGroup>
                      ) : (
                        <>
                          <h6>Status</h6>
                          <p>{statusEnum[delivery?.status]}</p>
                        </>
                      )
                    }
                  </CCol>
                  <CCol xs={6} className="d-flex align-items-start">
                    <CButton
                      onClick={handleShowChangeStatus}
                      variant="outline"
                      color={isChangingStatus ? "danger" : "primary"}
                    >
                      {
                        isChangingStatus ? "Cancel" : "Change Status"
                      }
                    </CButton>
                    {
                      isChangingStatus && (
                        <CButton
                          color="primary"
                          className="ml-3"
                          type="submit"
                        >
                          Save
                        </CButton>
                      )
                    }
                  </CCol>
                </CRow>
              </CForm>
            </CCol>
            <CCol xs={6}>
              {
                delivery?.packageIds?.map(packId => {
                  const pack = packages?.[packId];
                  return pack && (
                    <CCard>
                      <CCardBody>
                        <p><strong>{pack?.title}</strong></p>
                        <table>
                          {
                            pack?.items?.slice(0, 3).map(item => (
                              <tr>
                                <td style={{minWidth: 160, fontWeight: 600}}>{products?.[item.id]?.name}</td> 
                                <td>x {item.quantity}</td> 
                              </tr>
                            ))
                          }
                        </table>
                        {
                          (pack?.items?.length - 3 > 0) && (
                            <p>and {pack?.items?.length - 3} more items</p>
                          )
                        }
                      </CCardBody>
                    </CCard>
                  )
                })
              }
            </CCol>
            {
              delivery?.status === "arrived" && (
                <CCol xs={12}>
                  <Link to={deliveryId + "/unpack"}>
                    <CButton>
                      Unpack Delivery
                    </CButton>
                  </Link>
                </CCol>
              )
            }
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}
