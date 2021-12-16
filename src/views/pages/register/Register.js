import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createCompany } from 'src/store/actions/companyActions';
import { Link, useHistory } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const formSchema = object().shape({
    firstName: string()
      .required(),
    lastName: string()
      .required(),
    email: string()
      .email()
      .lowercase()
      .required(),
    password: string()
      .min(5, "Password harus minimal 5 karakter dan lebih.")
      .required(),
    address: string().required(),
    city: string().required(),
    country: string().required(),
    name: string().required()
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    validationSchema: formSchema,
  });

  async function onSubmit(data) {
    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    }

    const company = {
      name: data.name,
      address: data.address,
      city: data.city,
      country: data.country,
    }

    await dispatch(createCompany({user, company}));
    history.push("/login");
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <div className='d-flex'>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput 
                        type="text" 
                        placeholder="First Name" 
                        autoComplete="given-name"
                        {...register("firstName")}
                        innerRef={register("firstName").ref}
                      />
                    </CInputGroup>
                    <CInput 
                      className="ml-3"
                      type="text" 
                      placeholder="Last Name" 
                      autoComplete="family-name" 
                      {...register("lastName")}
                      innerRef={register("lastName").ref}
                    />
                  </div>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput 
                      type="text" 
                      placeholder="Email" 
                      autoComplete="email"
                      {...register("email")}
                      innerRef={register("email").ref}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput 
                      type="password" 
                      placeholder="Password" 
                      autoComplete="new-password"
                      {...register("password")}
                      innerRef={register("password").ref}
                    />
                  </CInputGroup>
                  {/* <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Repeat password" autoComplete="new-password" />
                  </CInputGroup> */}
                  <h4>Company Information</h4>
                  <CFormGroup>
                    <CLabel htmlFor='name'>Company Name</CLabel>
                    <CInput
                      id="name"
                      placeholder="PT StockIT"
                      { ...register("name") }
                      innerRef={register("name").ref}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor='address'>Company Address</CLabel>
                    <CInput
                      id="address"
                      placeholder="Jl. Menteng Sukabumi"
                      { ...register("address") }
                      innerRef={register("address").ref}
                    />
                  </CFormGroup>
                  <div className='d-flex'>
                    <CFormGroup className="w-100">
                      <CLabel htmlFor='city'>City</CLabel>
                      <CInput
                        id="city"
                        { ...register("city") }
                        innerRef={register("city").ref}
                      />
                    </CFormGroup>
                    <CFormGroup className="ml-3 w-100">
                      <CLabel htmlFor='country'>Country</CLabel>
                      <CInput
                        id="country"
                        { ...register("country") }
                        innerRef={register("country").ref}
                      />
                    </CFormGroup>
                  </div>
                  <CButton color="success" type='submit' block>Create Account</CButton>
                  <div className="w-100 text-center mt-3">
                    Already have an account? <Link to="/login">Log In!</Link>
                  </div>
                </CForm>
              </CCardBody>
              <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                  </CCol>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
