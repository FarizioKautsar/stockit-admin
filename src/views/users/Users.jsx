import React from 'react'
import { CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import { useSelector } from 'react-redux'
import {  isLoaded, useFirestoreConnect } from 'react-redux-firebase';

export default function Users() {
  const profile = useSelector(state => state.firebase.profile);
  const firestoreState = useSelector(state => state.firestore);
  const company = firestoreState.ordered.companies?.[0];
  const users = firestoreState.ordered.users;
  const roles = firestoreState.data.roles;
  console.log(roles);
  console.log(company);

  useFirestoreConnect([
    {
      collection: "users",
      ...company ? {where: [
        [...company ? [["companyId", "==", company?.id]] : []]
      ]} : {}
    },
    {
      collection: "roles"
    }
  ])

  return (
    <CCard>
      <CCardHeader>
        <h3>Users in {company?.name}</h3>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          loading={!isLoaded(users)}
          items={users}
          fields={[
            "name",
            "role"
          ]}
          scopedSlots={{
            name: u => (
              <td>
                {u.firstName + " " + u.lastName}
              </td>
            ),
            role: u => (
              <td>
                {roles?.[u?.roleId]?.name}
              </td>
            )
          }}
        />
      </CCardBody>
    </CCard>
  )
}
