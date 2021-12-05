import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, useFirebaseConnect, useFirestoreConnect } from 'react-redux-firebase';

const Companydetails = (props) => {
  const profile = useSelector(state => state.firebase.profile);
  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "warehouses" }
      ],
      storeAs: "warehouses"
    }
  ]);

  const firestoreState = useSelector(state => state.firestore);
  const company = firestoreState.ordered.companies?.[0];
  const warehouses = firestoreState.ordered.warehouses;
  console.log(warehouses);

  return (
    <CCard>
      <CCardHeader>
        <h3>{company?.name}</h3>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={6}>
            <CRow>
              <CCol xs={12}>
                <h6>Address</h6>
                <p>{company?.address}</p>
              </CCol>
              <CCol xs={6}>
                <h6>City</h6>
                <p>{company?.city}</p>
              </CCol>
              <CCol xs={6}>
                <h6>Country</h6>
                <p>{company?.country}</p>
              </CCol>
            </CRow>
          </CCol>
          <CCol xs={6}>
            <h6>Warehouses</h6>
            {
              warehouses?.map((wh, idx) => (
                <CCard key={idx}>
                  <CCardBody>
                    <div className="d-flex mb-3 justify-content-between align-items-end">
                      <p className="mb-0"><strong>{wh.name}</strong></p>
                      <CButton
                        color="primary"
                        variant="outline"
                      >
                        Details
                      </CButton>
                    </div>
                    <p>{wh.address}</p>
                  </CCardBody>
                </CCard>
              ))
            }
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
}

export default Companydetails;