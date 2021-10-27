import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel, CRow } from '@coreui/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createPackage } from 'src/store/actions/packageActions';
import { boolean, number, object, string } from 'yup';

export default function PackageForms(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const formSchema = object().shape({
    title: string().required(),
    description: string().required(),
    xDim: number().required(),
    yDim: number().required(),
    zDim: number().required(),
    warehouseId: string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  function onSubmit(data) {
    setIsSubmitting(true);
    const payload = { ...data, status: "delivery" }
    dispatch(createPackage(payload))
      // .then(res => {
      //   console.log(res)
      // })
      // .catch(err => {
      //   console.log(err);
      // })
      .finally(() => {
        setIsSubmitting(false);
      })
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <h3>
            Create Package
          </h3>
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CFormGroup className="w-100">
              <CLabel htmlFor="title">Title</CLabel>
              <CInput
                required
                {...register("title")}
                innerRef={register("title").ref}
              />
            </CFormGroup>
            <CFormGroup className="w-100">
              <CLabel htmlFor="description">Description</CLabel>
              <CInput
                required
                {...register("description")}
                innerRef={register("description").ref}
              />
            </CFormGroup>
            <CRow>
              <CCol xs={4}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="xDim">X Dimension</CLabel>
                  <CInput
                    required
                    type="number"
                    {...register("xDim")}
                    innerRef={register("xDim").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol xs={4}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="yDim">Y Dimension</CLabel>
                  <CInput
                    required
                    type="number"
                    {...register("yDim")}
                    innerRef={register("yDim").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol xs={4}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="zDim">Z Dimension</CLabel>
                  <CInput
                    required
                    type="number"
                    {...register("zDim")}
                    innerRef={register("zDim").ref}
                  />
                </CFormGroup>
              </CCol>
            </CRow>
            <div className="d-flex justify-content-end">
              <CButton disabled={isSubmitting} color="success" type="submit">
                Submit
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard> 
    </>
  )
}
