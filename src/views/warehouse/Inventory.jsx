import { CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router-dom'

export default function Inventory() {
  const warehouseId = useParams().warehouseId;
  console.log(warehouseId);
  const profile = useSelector(state => state.firebase.profile);

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        {
          collection: "warehouses",
          doc: warehouseId
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
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        {
          collection: "warehouses",
          doc: warehouseId,
          subcollections: [
            { collection: "shelves" }
          ]
        }
      ],
      storeAs: "shelves"
    },
  ])

  const firestoreState = useSelector(state => state.firestore);
  const warehouse = firestoreState.ordered.warehouses?.[0];
  const products = firestoreState.data.products;
  const shelves = firestoreState.ordered.shelves;

  return (
    <div>
      <CCard>
        <CCardHeader>
          <h3>Inventory</h3>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={shelves?.filter(s => s.items?.length > 0)}
            loading={!isLoaded(shelves)}
            fields={[
              { key: "id", label: "Shelf"},
              "items"
            ]}
            scopedSlots={{
              items: (s) => (
                <td>
                  <CDataTable
                    items={s?.items}
                    fields={[
                      "name",
                      "quantity"
                    ]}
                    scopedSlots={{
                      name: (i) => (
                        <td>
                          {products?.[i.id]?.name}
                        </td>
                      )
                    }}
                  />
                </td>
              )
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  )
}
