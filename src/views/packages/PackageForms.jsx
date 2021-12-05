import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel, CRow, CSelect, CTextarea } from '@coreui/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { MdArrowBack, MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import { createPackage } from 'src/store/actions/packageActions';
import { boolean, number, object, string } from 'yup';
import PackageInputs from './PackageInputs';
import { useHistory } from 'react-router';

export default function PackageForms(props) {
  const profile = useSelector(state => state.firebase.profile);
  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "warehouses" }
      ],
      storeAs: "warehouses"
    }
  ]);

  const warehouses = useSelector(state => state.firestore.ordered.warehouses);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([]);

  const history = useHistory();
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

  function handleItemAdd() {
    setItems(items.concat([{
      id: "",
      quantity: "",
      name: ""
    }]))
  }

  function handleItemDelete(index) {
    const newItems = items.filter((item, idx) => idx !== index);
    setItems(newItems);
  }

  const handleItemChange = (idx, prop) => value => {
    const newItems = [...items];
    newItems[idx][prop] = value;
    setItems(newItems);
  }

  function onSubmit(data) {
    setIsSubmitting(true);
    const payload = { ...data, status: "ready", items }
    dispatch(createPackage(payload))
      .finally(() => {
        history.push("/packages");
      })
  }

  return (
    <>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard>
          <CCardHeader>
            <h3>
              Create Package
            </h3>
          </CCardHeader>
          <CCardBody>
            <PackageInputs
              warehouses={warehouses}
              items={items}
              onItemChange={handleItemChange}
              onItemAdd={handleItemAdd}
              onItemDelete={handleItemDelete}
              register={register}
            />
          </CCardBody>
        </CCard> 
        <div className="d-flex justify-content-end mt-3">
          <CButton  color="success" type="submit">
            Submit
          </CButton>
        </div>
      </CForm>
    </>
  )
}