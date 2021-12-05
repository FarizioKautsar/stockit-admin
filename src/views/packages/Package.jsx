import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CInput, CRow } from '@coreui/react'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Barcode from 'react-barcode';
import QRCode from "react-qr-code";
import PackageQRCodePrint from './PackageQRCodePrint';
import { number, object } from 'yup';
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';

export default function Package() {
  const packageId = useParams().packageId;
  const profile = useSelector(state => state.firebase.profile);
  
  useFirestoreConnect([
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
      where: [
        ["packageId", "==", packageId]
      ]
    }
  ])

  const firestoreState = useSelector(state => state.firestore);
  const packages = firestoreState.data.packages;
  const pack = packages?.[Object.keys(packages)?.[0]];
  const products = firestoreState.data.products;
  const warehouses = firestoreState.data.warehouses;

  const formSchema = object().shape({
    status: number().required(),
  });
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  const printRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div>
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <h3>{pack?.title}</h3>
          <Link to={packageId + "/edit"}>
            <CButton
              color="primary"
            >
              Edit Package
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={6}>
              <CRow>
                <CCol xs={6}>
                  <h6>Description</h6>
                  <p>{pack?.description}</p>
                </CCol>
                <CCol xs={6}>
                  <h6>Warehouse</h6>
                  <p>{warehouses?.[pack?.warehouseId]?.name}</p>
                </CCol>
                <CCol xs={3}>
                  <h6>X Dim</h6>
                  <p>{pack?.xDim}cm</p>
                </CCol>
                <CCol xs={3}>
                  <h6>Y Dim</h6>
                  <p>{pack?.yDim}cm</p>
                </CCol>
                <CCol xs={3}>
                  <h6>Z Dim</h6>
                  <p>{pack?.zDim}cm</p>
                </CCol>
                <CCol xs={3}>
                  <h6>Total Vol.</h6>
                  <p>{pack?.xDim * pack?.yDim * pack?.zDim}cm3</p>
                </CCol>
                <CCol xs={6} className="p-4 text-center">
                  {
                    pack?.packageId &&
                    <QRCode value={pack?.packageId}/> 
                  }
                  <p className="mt-3">{pack?.packageId}</p>
                </CCol>
                <CCol xs={6} className="d-flex align-items-start">
                  <CInput
                    type="number"
                    defaultValue="1"
                    {...register("printAmount")}
                    innerRef={register("printAmount").ref}
                    className="w-25"
                  />
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={handlePrint}
                  >
                    Print QR Code
                  </CButton>
                </CCol>
              </CRow>
            </CCol>
            <CCol xs={6}>
              <h6>Items</h6>
              {
                pack?.items?.map((item, idx) => (
                  <CCard key={idx}>
                    <CCardBody>
                      <CRow>
                        <CCol xs={6}>
                          <p><strong>{products?.[item.id]?.name}</strong></p>
                        </CCol>
                        <CCol xs={6}>
                          <p>x {item.quantity}</p>
                        </CCol>
                        <CCol xs={12}>
                          <Barcode 
                            value={item.id}
                            height={80}
                            fontSize={14}
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                ))
              }
            </CCol>
          </CRow>
          <div className="d-none">
            <PackageQRCodePrint ref={printRef} pack={pack} printAmount={watch("printAmount")}/>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}
