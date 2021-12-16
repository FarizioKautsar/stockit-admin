import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { WarehouseMapComponent } from './WarehouseForms';

export default function Warehouse() {
  const warehouseId = useParams().warehouseId;
  const profile = useSelector(state => state.firebase.profile);

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "warehouses", doc: warehouseId }
      ],
      storeAs: "warehouses"
    }
  ])

  const firestoreState = useSelector(store => store.firestore);
  const warehouse = firestoreState.ordered.warehouses?.[0];

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>{warehouse?.name}</h3>
        <Link to={warehouseId + "/edit"}>
          <CButton
            color="primary"
          >
            Edit Warehouse
          </CButton>
        </Link>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={6}>
            <h6>Name</h6>
            <p>{warehouse?.name}</p>
            <h6>Address</h6>
            <p>{warehouse?.address}</p>
            <h6>Number of Shelf</h6>
            <p>{warehouse?.shelvesAmount}</p>
            <br/>
            <CButton is={Link} to={warehouseId + "/inventory"}>
              View Inventory
            </CButton>
          </CCol>
          <CCol xs={6}>
            <h6>Location</h6>
            {
              warehouse &&
              <WarehouseMapComponent noAction markerLocation={{ 
                lat: warehouse.location.latitude, 
                lng: warehouse.location.longitude 
              }}/>
            }
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}
