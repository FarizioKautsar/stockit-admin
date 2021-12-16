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
import _, { map } from 'underscore';

export default function PackageForms(props) {
  const profile = useSelector(state => state.firebase.profile);
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
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: formSchema,
  });
  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "warehouses" }
      ],
      storeAs: "warehouses"
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { collection: "products" }
      ],
      storeAs: "products"
    }, 
    ...watch("warehouseId") ? [{
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        { 
          collection: "warehouses",
          doc: watch("warehouseId"),
        },
        {
          collection: "shelves"
        }
      ],
      storeAs: "shelves"
    }] : []
  ]);

  const firestoreState = useSelector(state => state.firestore);
  const warehouses = firestoreState.ordered.warehouses;
  const products = firestoreState.data.products;
  var shelves = {...firestoreState.data.shelves};
  const shelvesArr = firestoreState.ordered.shelves;
  const itemsArrTemp = shelvesArr?.map(s => s.items?.map(i => ({ ...i, shelfId: s.id })));
  var itemsArr = [].concat(...itemsArrTemp ? itemsArrTemp : [])?.filter(i => i);
  console.log(itemsArr);
  const itemIds = Array.from(new Set(itemsArr?.map(i => i.id)));

  const itemQtys = itemsArr.reduce((a, v) => {
    const itemQty = itemsArr.filter(i => i.id === v.id).map(i => i.quantity).reduce((a, b) => a+b)
    return { ...a, [v.id]: itemQty}
  }, {})

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([]);

  const history = useHistory();
  const dispatch = useDispatch();


  function handleItemAdd() {
    setItems(items.concat([{
      id: "",
      quantity: "",
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

  async function onSubmit(data) {
    setIsSubmitting(true);
    var shelvesTemp = {...shelves};

    // Loop over items added
    for (const itemId of items.map(i => i.id)) {
      var qtyTaken = parseInt(items.filter(i => i.id === itemId)[0].quantity);

      // Sorted because we will decrement shelf with least amount of items first 
      var sortedItem = _.sortBy(itemsArr.filter(i => i.id === itemId), "quantity");

      for (const item of [...sortedItem]) {
        var shelf = shelvesTemp[item.shelfId];

        // Remove item from shelves
        shelvesTemp[item.shelfId] = { ...shelf, items: shelf.items.filter(i => (i.id !== item.id)) };
        if (item.quantity - qtyTaken > 0) {
          // But if there is still some left, add it back
          shelvesTemp[item.shelfId].items.push({ ...item, quantity: item.quantity - qtyTaken })
        } 
        qtyTaken -= item.quantity;
      }
    }

    const payload = { 
      pack: { ...data, status: "ready", items}, 
      shelves: Object.keys(shelvesTemp).map(key => ({ 
        id: key, 
        items: shelvesTemp[key].items?.map(i => ({ id: i.id, quantity: i.quantity })) 
      })) 
    };
    console.log(payload.pack)
    await dispatch(createPackage(payload));
    history.push("/packages")
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
            <CRow>
              <CCol sm={12} md={6}>
                {
                  warehouses && 
                  <CFormGroup className="w-100">
                    <CLabel htmlFor="warehouseId">Warehouse</CLabel>
                    <CSelect
                      required
                      id="warehouseId"d
                      defaultValue=""
                      type="warehouseId"
                      {...register("warehouseId")}
                      innerRef={register("warehouseId").ref}
                    >
                      <option disabled value="">- Select Warehouse -</option>
                      {
                        warehouses.map(wh => (
                          <option value={wh.id}>{wh.name}</option>
                        ))
                      }
                    </CSelect>
                  </CFormGroup>
                }
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
                  <CTextarea
                    required
                    rows="4"
                    id="description"
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
              </CCol>
              <CCol sm={12} md={6}>
                <CLabel>Items</CLabel>
                {
                  !items? (
                    <p>
                      Click the button below to add item.
                    </p>
                  ) : items.map((item, idx) => (
                    <CCard>
                      <CCardBody className="d-flex align-items-center">
                        <CRow>
                          <CCol xs={8}>
                            <CFormGroup>
                              <CLabel htmlFor="productId">Product</CLabel>
                              <CSelect
                                required
                                id="productId"
                                value={item.id}
                                onChange={(e) => handleItemChange(idx, "id")(e.target.value)}
                              >
                                {
                                  itemIds?.map(itemId => (
                                    <option value={itemId}>{products?.[itemId]?.name}</option>
                                  ))
                                }
                              </CSelect>
                            </CFormGroup>
                          </CCol>
                          <CCol xs={4}>
                            <CFormGroup>
                              <CLabel htmlFor="quantity">Qty. { itemQtys?.[item.id] && `(Max ${itemQtys?.[item.id]})` }</CLabel>
                              <CInput
                                required
                                type="number"
                                id="quantity"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, "quantity")(e.target.value)}
                              />
                            </CFormGroup>
                          </CCol>
                        </CRow>
                        <CButton
                          onClick={() => handleItemDelete(idx)}
                          color="danger"
                          className="ml-3"
                          style={{
                            height: "fit-content"
                          }}
                        >
                          <MdDelete/>
                        </CButton>
                      </CCardBody>
                    </CCard>
                  ))
                }
                <CButton
                  className="w-100"
                  color="primary"
                  variant="outline"
                  onClick={handleItemAdd}
                >
                  + Add Item
                </CButton>
              </CCol>
            </CRow>
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