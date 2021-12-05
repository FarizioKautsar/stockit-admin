import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel, CRow, CSelect, CSpinner } from '@coreui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdArrowBack } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { signUp } from 'src/store/actions/authActions';
import { number } from 'yup';
import { string } from 'yup';
import { object } from 'yup';

export default function UserForms() {
  useFirestoreConnect(['roles']);
  const roles = useSelector((state) => state.firestore.ordered.roles);
  console.log(isLoaded(roles));
  console.log(roles);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const formSchema = object().shape({
    firstName: string().required(),
    lastName: string().required(),
    email: string().required(),
    password: string().required(),
    username: string().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  function onSubmit(data) {
    // console.log(data);
    setIsSubmitting(true);
    const payload = { ...data }
    dispatch(signUp(payload))
      // .then(res => {
      //   console.log(res)
      // })
      // .catch(err => {
      //   console.log(err);
      // })
      // .finally(() => {
      //   setIsSubmitting(false);
      // })
  }

  return (
    <div>
      <Link to="/users">
        <CButton className="mb-3">
          <MdArrowBack/>
          Back
        </CButton>
      </Link>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard>
          <CCardHeader>
            <h3>Create User</h3>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="firstName">First Name</CLabel>
                  <CInput
                    required
                    id="firstName"
                    {...register("firstName")}
                    innerRef={register("firstName").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="lastName">Last Name</CLabel>
                  <CInput
                    required
                    id="lastName"
                    {...register("lastName")}
                    innerRef={register("lastName").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="username">Username</CLabel>
                  <CInput
                    required
                    id="username"
                    {...register("username")}
                    innerRef={register("username").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="email">Email</CLabel>
                  <CInput
                    required
                    id="email"
                    {...register("email")}
                    innerRef={register("email").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="password">Password</CLabel>
                  <CInput
                    required
                    id="password"
                    type="password"
                    {...register("password")}
                    innerRef={register("password").ref}
                  />
                </CFormGroup>
              </CCol>
              <CCol sm={12} md={6}>
                <CFormGroup className="w-100">
                  <CLabel htmlFor="roleId">Role</CLabel>
                  {
                    isLoaded(roles) ?
                    <CSelect
                      required
                      id="roleId"
                      type="roleId"
                      {...register("roleId")}
                      innerRef={register("roleId").ref}
                    >
                      <option disabled>- Select Role -</option>
                      {
                        roles.map(role => (
                          <option value={role.id}>{role.name[0].toUpperCase() + role.name.substring(1)}</option>
                        ))
                      }
                    </CSelect>
                    :
                    <CSpinner/>
                  }
                </CFormGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <div className="d-flex justify-content-end mt-3">
          <CButton disabled={isSubmitting} color="success" type="submit">
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  )
}
