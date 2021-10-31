import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CInput, CInputGroup, CInputGroupPrepend, CInputGroupText, CInvalidFeedback, CRow } from '@coreui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { DISPLAY_NAME_ERROR_MESSAGE, DISPLAY_NAME_REGEX } from 'src/utils/globals';
import { object, string } from 'yup';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { signIn } from 'src/store/actions/authActions';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

export default function Login(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  useFirebase()

  const firebase = useSelector(state => state.firebase);
  console.log(firebase);

  const auth = useSelector(state => state.firebase.auth);
  const [passwordInputVisibility, setPasswordInputVisibility] = useState(false);

  const formSchema = object().shape({
    displayName: string()
      .matches(DISPLAY_NAME_REGEX, DISPLAY_NAME_ERROR_MESSAGE)
      .required(),
    email: string()
      .email()
      .lowercase()
      .required(),
    password: string()
      .min(5, "Password harus minimal 5 karakter dan lebih.")
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    validationSchema: formSchema,
  });

  function onSubmit(data) {
    dispatch(signIn({
      email: data.email, 
      password: data.password
    }))
  }

  if (auth?.isLoaded && !auth?.isEmpty) {
    history.replace("/");
  }

  function handlePasswordInputVisibility() {
    setPasswordInputVisibility(!passwordInputVisibility);
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        {...register("email")}
                        innerRef={register("email").ref}
                        type="text"
                        invalid={errors.email}
                        placeholder="Email"
                        autoComplete="email"
                      />
                      <CInvalidFeedback>
                        {errors.email?.message}
                      </CInvalidFeedback>
                    </CInputGroup>
                    <div className="d-flex w-100">
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          {...register("password")}
                          innerRef={register("password").ref}
                          type={passwordInputVisibility ? "text" : "password"}
                          invalid={errors.password}
                          placeholder="Password"
                          autoComplete="current-password"
                        />
                        <CButton
                          className="ml-3"
                          onClick={handlePasswordInputVisibility}
                        >
                          {passwordInputVisibility ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </CButton>
                        <CInvalidFeedback>
                          {errors.password?.message}
                        </CInvalidFeedback>
                      </CInputGroup>
                    </div>
                    <div className="d-flex align-items-center">
                      <CButton
                        disabled={!auth?.isLoaded}
                        type="submit"
                        color="primary"
                        className="px-4"
                        data-testid="buttonLogin"
                      >
                        Login
                      </CButton>
                      {/* <div className="ml-3">
                        Need an account? <Link to="signup">Sign Up</Link>
                      </div> */}
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
