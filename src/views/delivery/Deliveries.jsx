import { CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CRow, CSelect } from '@coreui/react';
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import moment from "moment";
import { MdArrowRight, MdArrowRightAlt } from 'react-icons/md';
import useQueryString from 'src/hooks/useQueryString';
import { object } from 'yup';
import { string } from 'yup';
import { number } from 'yup';
import { date } from 'yup';
import { statusEnum } from 'src/utils/globals';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_NO = 0;
const DEFAULT_SEARCH = "";
const DEFAULT_ID = "";

export default function Deliveries() {
  const profile = useSelector(state => state.firebase.profile);

  const [query, setQueryStr] = useQueryString(
    object().shape({
      id: string().default(DEFAULT_ID),
      page: number().default(DEFAULT_PAGE_NO),
      pageSize: number().default(DEFAULT_PAGE_SIZE),
      fromDate: date(),
      toDate: date(),
      from: string(),
      to: string(),
    })
  );
  const { id, page, pageSize, fromDate, toDate, from, to } = query;

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "deliveries",
          ...from || to ? {
            where: [
              ...from ? [["warehouseIdFrom", "==", from]] : [],
              ...to ? [["warehouseIdTo", "==", to]] : [],
            ]
          } : {}
        }
      ],
      storeAs: "deliveries"
    },
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
  const deliveries = firestoreState.ordered.deliveries;
  const warehousesObj = firestoreState.data.warehouses;
  const warehouses = firestoreState.ordered.warehouses;

  function handleFromChange(from) {
    setQueryStr({
      ...query,
      from
    })
  }

  function handleToChange(to) {
    setQueryStr({
      ...query,
      to
    })
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <h3>Deliveries</h3>
          <Link to="/deliveries/create">
            <CButton
              color="primary"
            >
              Create Delivery
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          {
            isLoaded(warehouses) &&
            <CRow>
              <CCol xs={3}>
                <CFormGroup>
                  <CLabel htmlFor="from">From</CLabel>
                  <CSelect defaultValue={from || ""} id="from" onChange={(e) => handleFromChange(e.target.value)}>
                    <option value="">- Source Warehouse -</option>
                    {
                      warehouses.map(w => (
                        <option value={w.id}>{w.name}</option>
                      ))
                    }
                  </CSelect>
                </CFormGroup>
              </CCol>
              <CCol xs={3}>
                <CFormGroup>
                  <CLabel htmlFor="to">To</CLabel>
                  <CSelect defaultValue={to || ""} id="to" onChange={(e) => handleToChange(e.target.value)}>
                    <option value="">- Destination Warehouse -</option>
                    {
                      warehouses.map(w => (
                        <option value={w.id}>{w.name}</option>
                      ))
                    }
                  </CSelect>
                </CFormGroup>
              </CCol>
            </CRow>
          }
          <CDataTable
            items={deliveries}
            loading={!isLoaded(firestoreState)}
            fields={[
              { key: "warehouseIdFrom", label: "From" },
              { key: "rightArrow", label: "" },
              { key: "warehouseIdTo", label: "To" },
              "description",
              "status",
              "createdAt",
              { key: "actions", label: "" },
            ]}
            scopedSlots={{
              createdAt: (d) => (
                <td>{moment.unix(d.createdAt?.seconds).format("LLL")}</td>
              ),
              warehouseIdFrom: d => (
                <td>{warehousesObj?.[d.warehouseIdFrom]?.name}</td>
              ),
              rightArrow: () => (
                <td><MdArrowRightAlt/></td>
              ),
              warehouseIdTo: d => (
                <td>{warehousesObj?.[d.warehouseIdTo]?.name}</td>
              ),
              status: d => (
                <td>{statusEnum[d.status]}</td>
              ),
              actions: d => (
                <td className="d-flex">
                  <Link to={"/deliveries/" + d.id}>
                    <CButton color="primary" variant="outline" className="mr-3">
                      Details
                    </CButton>
                  </Link>
                  <Link to={"/deliveries/" + d.id + "/edit"}>
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
