import { CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CRow } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import useQueryString from 'src/hooks/useQueryString';
import stockLoader from 'src/reusable/stockLoader';
import { date, number, object, string } from 'yup';
import moment from "moment";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NO = 0;
const DEFAULT_SEARCH = "";
const DEFAULT_ID = "";

export default function Packages() {
  const profile = useSelector(state => state.firebase.profile);
  const [query, setQueryStr] = useQueryString(
    object().shape({
      id: string().default(DEFAULT_ID),
      page: number().default(DEFAULT_PAGE_NO),
      pageSize: number().default(DEFAULT_PAGE_SIZE),
      search: string().default(DEFAULT_SEARCH),
      fromDate: date(),
      toDate: date(),
      warehouse: string(),
      shelf: string()
    })
  );
  const { id, page, pageSize, search, fromDate, toDate, warehouse, shelf } = query;

  const where = [
    ["companyId", "==", `${profile.companyId}`],
    ["title", ">=", search],
    ["title", "<=", search + '\uf8ff'],
    ...id ? [["packageId", "==", id]] : [],
    ...warehouse ? [["warehouseId", "==", warehouse]] : [],
    ...fromDate ? [["createdAt", ">=", fromDate]] : [],
    ...toDate ? [["createdAt", "<=", toDate]] : [],
  ]

  useFirestoreConnect(
    [
      {
        collection: "companies",
        doc: `${profile.companyId}`,
        subcollections: [
          { collection: "warehouses" }
        ],
        storeAs: "warehouses"
      },
      { 
        collectionGroup: "packages",
        where,
      },
    ]
  )
  const firestore = useSelector(state => state.firestore);
  const warehouses = firestore.data.warehouses;
  var packages = firestore.data.packages;
  packages = packages && Object.keys(packages).map(key => ({ ...packages[key], id: key }));

  function handleSearchChange(search) {
    setQueryStr({
      ...query,
      search
    })
  }

  function handleIdChange(id) {
    setQueryStr({
      ...query,
      id
    })
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <h3>
            Packages
          </h3>
          <Link to="/packages/create">
            <CButton color="primary">
              Create Package
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={3}>
              <CFormGroup className="w-100">
                <CLabel htmlFor="title">Title</CLabel>
                <CInput id="title" onChange={(e) => handleSearchChange(e.target.value)} />
              </CFormGroup>
            </CCol>
            <CCol xs={3}>
              <CFormGroup className="w-100">
                <CLabel htmlFor="id">ID</CLabel>
                <CInput id="id" onChange={(e) => handleIdChange(e.target.value)} />
              </CFormGroup>
            </CCol>
          </CRow>
          <CDataTable
            items={packages}
            loading={!isLoaded(packages)}
            fields={[
              "title",
              "author",
              "volume",
              "warehouse",
              "createdAt",
              "status",
              { key: "actions", label: "" }
            ]}
            scopedSlots={{
              createdAt: (p) => (
                <td>{moment.unix(p.createdAt?.seconds).format("LLL")}</td>
              ),
              volume: (p) => (
                <td>{`${p.xDim}x${p.yDim}x${p.zDim}cm`}</td>
              ),
              author: (p) => (
                <td>{p.authorFirstName + " " + p.authorLastName}</td>
              ),
              warehouse: (p) => {
                return (
                  <td>{warehouses?.[p.warehouseId]?.name}</td>
                )
              },
              actions: (p) => (
                <td className="d-flex">
                  <Link to={"/packages/" + p.id}>
                    <CButton color="primary" variant="outline" className="mr-3">
                      Details
                    </CButton>
                  </Link>
                  <Link to={"/packages/" + p.id + "/edit"}>
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
    </div>
  )
}
