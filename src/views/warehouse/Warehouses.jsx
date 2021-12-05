import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom'

export default function Warehouses() {
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
  ])

  const firestoreState = useSelector(state => state.firestore);
  const warehouses = firestoreState.ordered.warehouses;

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <h3>Warehouses</h3>
        <Link to="/warehouses/create">
          <CButton
            color="primary"
          >
            Create Warehouse
          </CButton>
        </Link>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={warehouses}
          loading={!isLoaded(warehouses)}
          fields={[
            "name",
            "address",
            "shelvesAmount",
            { key: "actions", label: "" }
          ]}
          scopedSlots={{
            actions: wh => (
              <td className="d-flex justify-content-end">
                <Link to={"/warehouses/" + wh.id}>
                  <CButton color="primary" variant="outline" className="mr-3">
                    Details
                  </CButton>
                </Link>
                <Link to={"/warehouses/" + wh.id}>
                  <CButton color="primary" variant="outline" className="mr-3">
                    Show Inventory
                  </CButton>
                </Link>
                <Link to={"/warehouses/" + wh.id + "/edit"}>
                  <CButton color="primary" >
                    Edit
                  </CButton>
                </Link>
              </td>
            )
          }}
        />
      </CCardBody>
    </CCard>
  )
}
