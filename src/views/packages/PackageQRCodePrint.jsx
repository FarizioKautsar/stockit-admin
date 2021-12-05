import { CCol, CRow } from '@coreui/react';
import { width } from 'dom7';
import React, { forwardRef } from 'react'
import QRCode from 'react-qr-code';
import logo from '../../assets/images/stockit-bg-light.png';

const PackageQRCodePrint = forwardRef((props, ref) => {
  const { pack, printAmount } = props;
  
  const repArr = new Array(Math.max(parseInt(printAmount) || 0, 0)).fill(1);
  
  return (
    <div ref={ref}>
      <CRow>
        {
          repArr.map((i) => (
            <CCol xs={4} className="p-3 d-flex justify-content-center" >
              <div
                style={{
                  borderRadius: "8px",
                  border: "2px solid #3D2C8D",
                  padding: "24px",
                  width: 256+52
                }}
              >
                {
                  pack?.packageId &&
                  <QRCode value={pack?.packageId}/>
                }
                <div className="d-flex mt-3" >
                  <img src={logo} height={40}/>
                  <div className="w-100 ml-3">
                    <p className="mb-0">{pack?.title}</p>
                    <p className="mb-0">
                      <strong>
                        {pack?.packageId}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </CCol>
          ))
        }
      </CRow>
    </div>
  )
})

export default PackageQRCodePrint;