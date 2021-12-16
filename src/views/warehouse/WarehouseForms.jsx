import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel, CRow, CTextarea } from '@coreui/react'
import React, { useState } from 'react'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router';
import { compose, withProps } from 'recompose';
import { createWarehouse } from 'src/store/actions/warehouseActions';
import { number, object, string } from 'yup';

export const WarehouseMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "240px" }} />,
    mapElement: <div style={{ height: "100%" }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={props.markerLocation}
      onClick={!props.noAction && props.onMapClick}
    >
      <Marker position={props.markerLocation}/>
    </GoogleMap>
  )
})

function WarehouseForms(props) {
  const firestore = useFirestore();
  const history = useHistory();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = object().shape({
    name: string().required(),
    address: string().required(),
    city: string().required(),
    country: string().required(),
    shelvesAmount: number().required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });

  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  function handleLocationChange(loc) {
    setLocation({
      lat: loc.latLng.lat(),
      lng: loc.latLng.lng(),
    })
  }

  async function onSubmit(data) {
    setIsSubmitting(true);
    const payload = {...data, location};
    console.log("CREATING")
    await dispatch(createWarehouse(payload));
    setIsSubmitting(false);
    history.push("/warehouses");
  }

  return (
    <CForm onSubmit={handleSubmit(onSubmit)}>
      <CCard>
        <CCardHeader>
          <h3>Create Warehouse</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={6}>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup>
                    <CLabel htmlFor="name">Name</CLabel>
                    <CInput
                      id="name"
                      required
                      {...register("name")}
                      innerRef={register("name").ref}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12}>
                  <CFormGroup>
                    <CLabel htmlFor="address">Address</CLabel>
                    <CTextarea
                      id="address"
                      rows="3"
                      required
                      {...register("address")}
                      innerRef={register("address").ref}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={6}>
                  <CFormGroup>
                    <CLabel htmlFor="shelvesAmount">Number of Shelves</CLabel>
                    <CInput
                      type="number"
                      id="shelvesAmount"
                      required
                      {...register("shelvesAmount")}
                      innerRef={register("shelvesAmount").ref}
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCol>
            <CCol xs={6}>
              <CLabel>Location</CLabel>
              <WarehouseMapComponent
                markerLocation={location}
                onMapClick={handleLocationChange}
              />
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
  )
}

export default WarehouseForms;