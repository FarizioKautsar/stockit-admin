import { CCard, CCardBody, CFormGroup, CInput, CLabel } from '@coreui/react';
import React from 'react'

export default function CompanyNameForm(props) {
  let { register } = props;
  return (
    <>
      <CCard>
        <CCardBody>
          <CFormGroup className="w-100">
            <CLabel htmlFor="name">Company Name</CLabel>
            <CInput
              required
              id="name"
              {...register("name")}
              innerRef={register("name").ref}
            />
          </CFormGroup>
          <CFormGroup className="w-100">
            <CLabel htmlFor="city">Company Location</CLabel>
            <div>
              
            </div>
            <CInput
              required
              placeholder="Company's City"
              id="city"
              {...register("city")}
              innerRef={register("city").ref}
            />
          </CFormGroup>
          <CFormGroup className="w-100">
            <CLabel htmlFor="name">Company Name</CLabel>
            <CInput
              required
              placeholder="Company's Country"
              id="name"
              {...register("name")}
              innerRef={register("name").ref}
            />
          </CFormGroup>
        </CCardBody>
      </CCard>
    </>
  )
}
