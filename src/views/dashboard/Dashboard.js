import React, { lazy } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { GoPackage } from 'react-icons/go'
import { BsTruck } from 'react-icons/bs'
import { BiUser } from 'react-icons/bi'

import MainChartExample from '../charts/MainChartExample.js'
import { useSelector } from 'react-redux'
import { useFirebaseConnect, useFirestoreConnect } from 'react-redux-firebase'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { FaWarehouse } from 'react-icons/fa'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

const Dashboard = () => {
  const history = useHistory();
  const auth = useSelector(state => state.firebase.auth)

  if (auth?.isLoaded && auth?.isEmpty) {
    history.replace("/login");
  }

  const iconStyle = { width: "60px", height: "60px", marginBottom: "1rem" };

  return (
    <>
      <h1>What do you want to manage today?</h1>
      <br/>
      <CRow>
        <CCol xs={3}>
          <CButton is={Link} to="/warehouses" color="primary" variant="outline" className="p-0 w-100">
            <CCard className="m-0 bg-transparent">
              <CCardBody>
                <FaWarehouse style={iconStyle}/>
                <h4>Warehouses</h4>
              </CCardBody>
            </CCard>
          </CButton>
        </CCol>
        <CCol xs={3}>
        <CButton is={Link} to="/deliveries" color="primary" variant="outline" className="p-0 w-100">
            <CCard className="m-0 bg-transparent">
              <CCardBody>
                <BsTruck style={iconStyle}/>
                <h4>Deliveries</h4>
              </CCardBody>
            </CCard>
          </CButton>
        </CCol>
        <CCol xs={3}>
          <CButton is={Link} to="/packages" color="primary" variant="outline" className="p-0 w-100">
            <CCard className="m-0 bg-transparent">
              <CCardBody>
                <GoPackage style={iconStyle}/>
                <h4>Packages</h4>
              </CCardBody>
            </CCard>
          </CButton>
        </CCol>
        <CCol xs={3}>
          <CButton is={Link} to="/users" color="primary" variant="outline" className="p-0 w-100">
            <CCard className="m-0 bg-transparent">
              <CCardBody>
                <BiUser style={iconStyle}/>
                <h4>Users</h4>
              </CCardBody>
            </CCard>
          </CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
