import { CButton, CCard, CCardBody, CModal, CModalHeader, CModalBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel, CRow, CSelect, CSpinner, CTextarea, CDataTable } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdArrowBack, MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { isLoaded, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { createDelivery, updateDelivery } from 'src/store/actions/deliveryActions';
import { object, string } from 'yup';
import { useHistory, useParams } from 'react-router';
import moment from "moment";

function PackageFormPopup(props) {
  return (
    <CModal
      show={props.show}
      onClose={props.onClose}
    >
      <CModalHeader closeButton>
        <h4>Add Package</h4>
      </CModalHeader>
    </CModal>
  )
}

function PackageSelectPopup(props) {
  const { warehouseId, packageIds } = props;

  const firestoreState = useSelector(state => state.firestore);
  var packages = firestoreState.data.packages;
  packages = packages && Object.keys(packages)
    .map(key => ({ ...packages[key], id: key }))
    .filter(p => !packageIds.includes(p.id) && p.warehouseId === warehouseId && p.status === "ready");

  return (
    <CModal
      show={props.show}
      onClose={props.onClose}
    >
      <CModalHeader closeButton>
        <h4>Select Package</h4>
      </CModalHeader>
      <CModalBody>
        <CDataTable
          items={packages}
          loading={!isLoaded(firestoreState)}
          fields={[
            "title",
            "volume",
            "createdAt",
            { key: "select", label: "" }
          ]}
          scopedSlots={{
            createdAt: (p) => (
              <td>{moment.unix(p.createdAt?.seconds).format("LLL")}</td>
            ),
            volume: (p) => (
              <td>{`${p.xDim}x${p.yDim}x${p.zDim}`}</td>
            ),
            select: (p) => (
              <td>
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => {
                    props.onAddPackage(p.id);
                  }}
                >
                  Add
                </CButton>
              </td>
            )
          }}
        />
      </CModalBody>
    </CModal>
  )
}

export default function DeliveryForms() {
  const dispatch = useDispatch();
  const history = useHistory();
  const deliveryId = useParams().deliveryId || "";

  const profile = useSelector(state => state.firebase.profile);
  const [showSelectPackages, setShowSelectPackages] = useState(false);
  const [showCreatePackage, setShowCreatePackage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageIds, setPackageIds] = useState([]);

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "warehouses" },
      ],
      storeAs: "warehouses",
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "deliveries",
          doc: deliveryId,
        },
      ],
      storeAs: "deliveries",
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "products" },
      ],
      storeAs: "products",
    },
    {
      collectionGroup: "packages",
      where: [
        ["companyId", "==", `${profile.companyId}`]
      ]
    }
  ]);

  const firestoreState = useSelector(state => state.firestore);
  const warehouses = firestoreState.ordered.warehouses;
  const delivery = deliveryId && firestoreState.ordered.deliveries?.[0];
  const products = firestoreState.data.products;
  const packages = firestoreState.data.packages;

  useEffect(() => {
    if (delivery?.packageIds) {
      setPackageIds(delivery?.packageIds);
    }
  }, [delivery])

  const formSchema = object().shape({
    description: string().required(),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  function handleAddPackage(packageId) {
    setPackageIds(packageIds.concat([packageId]));
  }

  function handleRemovePackage(packageId) {
    setPackageIds(packageIds.filter(p => p !== packageId));
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const payload = {...data, packageIds};
    const updatePayload = {...data, packageIds, id: deliveryId}
    dispatch(deliveryId ? updateDelivery(updatePayload) : createDelivery(payload))
      .finally(() => {
        history.push("/deliveries")
        // setIsSubmitting(false);
      })
  }

  return (
    <div>
      <PackageSelectPopup 
        show={showSelectPackages}
        onClose={() => setShowSelectPackages(false)}
        packageIds={packageIds} 
        warehouseId={watch("warehouseIdFrom")}
        onAddPackage={handleAddPackage}
      />
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard>
          <CCardHeader>
            <h3>
              {
                deliveryId ?
                "Edit " + deliveryId
                :
                "Create Delivery"
              }
            </h3>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm={12} md={6}>
                <CRow>
                  <CCol sm={12} md={6}>
                    <CFormGroup className="w-100">
                      <CLabel htmlFor="warehouseIdFrom">From</CLabel>
                      <CSelect
                        required
                        id="warehouseIdFrom"
                        disabled={packageIds?.length}
                        defaultValue={ delivery?.warehouseIdFrom || "" }
                        type="warehouseIdFrom"
                        {...register("warehouseIdFrom")}
                        innerRef={register("warehouseIdFrom").ref}
                      >
                        <option disabled value="">- Select Source -</option>
                        {
                          warehouses?.map(wh => (
                            <option value={wh.id}>{wh.name}</option>
                          ))
                        }
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol sm={12} md={6}>
                    <CFormGroup className="w-100">
                      <CLabel htmlFor="warehouseIdTo">To</CLabel>
                      <CSelect
                        required
                        id="warehouseIdTo"
                        type="warehouseIdTo"
                        defaultValue={ delivery?.warehouseIdTo || "" }
                        {...register("warehouseIdTo")}
                        innerRef={register("warehouseIdTo").ref}
                      >
                        <option disabled value="">- Select Destination -</option>
                        <option value="custom">Custom...</option>
                        {
                          warehouses?.map(wh => (
                            <option value={wh.id}>{wh.name}</option>
                          ))
                        }
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                </CRow>
                {
                  watch("warehouseIdTo") === "custom" && (
                    <CFormGroup className="w-100">
                      <CLabel htmlFor="destAddress">Destination Address</CLabel>
                      <CTextarea
                        required
                        rows="3"
                        id="destAddress"
                        {...register("destAddress")}
                        innerRef={register("destAddress").ref}
                      />
                    </CFormGroup>
                  )
                }
                <CFormGroup className="w-100">
                  <CLabel htmlFor="description">Delivery Description</CLabel>
                  <CTextarea
                    required
                    defaultValue={ delivery?.description || "" }
                    rows="4"
                    id="description"
                    {...register("description")}
                    innerRef={register("description").ref}
                  />
                </CFormGroup>
                {/* <CFormGroup>
                  <CLabel htmlFor="arrivalDate">Approx. Arrival Date</CLabel>
                  <CInput
                    type="date"
                    id="arrivalDate"
                    {...register("arrivalDate")}
                    innerRef={register("arrivalDate").ref}
                  />
                </CFormGroup> */}
              </CCol>
              <CCol sm={12} md={6}>
                {
                  !packageIds ? (
                    <p>
                      Click the button below to add package.
                    </p>
                  ) : isLoaded(packages) && packageIds.map((packId, idx) => {
                    const pack = packages[packId];
                    return (
                      <CCard>
                        <CCardBody>
                          <div className="d-flex justify-content-between">
                            <p><strong>{pack.title}</strong></p>
                            <CButton
                              color="danger"
                              variant="outline"
                              onClick={() => handleRemovePackage(packId)}
                            >
                              <MdDelete/>
                            </CButton>
                          </div>
                          <table>
                            {
                              pack.items.slice(0, 3).map(item => (
                                <tr>
                                  <td style={{minWidth: 160, fontWeight: 600}}>{products[item.id]?.name}</td> 
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
                        </CCardBody>
                      </CCard>
                    )
                  })
                }
                {
                  (watch("warehouseIdFrom") || deliveryId) &&
                  <div className="d-flex">
                    <CButton
                      className="w-100"
                      color="primary"
                      variant="outline"
                      onClick={() => setShowSelectPackages(true)}
                    >
                      Add Package
                    </CButton> 
                    {/* <CButton
                      color="primary"
                      className="ml-3 w-100"
                    >
                      Create New Package
                    </CButton> */}
                  </div>
                }
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <div className="d-flex justify-content-end mt-3">
          <CButton 
            // disabled={isSubmitting} 
            color="success" 
            type="submit"
          >
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  )
}
