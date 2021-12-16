import { CButton, CCard, CCardBody, CCol, CFormGroup, CInput, CLabel, CRow, CSelect, CTextarea } from '@coreui/react';
import React from 'react'
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
export default function PackageInputs(props) {
  const { register, items, warehouses, watch } = props;
  const profile = useSelector(state => state.firebase.profile);
  // console.log("WAREHOUSEID", watch("warehouseId"));

  useFirestoreConnect([
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
  ])

  const firestoreState = useSelector(state => state.firestore);
  const products = firestoreState.data.products;
  const itemsArrTemp = firestoreState.ordered.shelves?.map(s => s.items);
  const itemsArr = [].concat(...itemsArrTemp ? itemsArrTemp : [])?.filter(i => i);
  const itemIds = Array.from(new Set(itemsArr?.map(i => i.id)));
  console.log(itemIds);
  console.log(itemsArr);

  return (
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
                        onChange={(e) => props.onItemChange(idx, "id")(e.target.value)}
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
                      <CLabel htmlFor="quantity">Qty.</CLabel>
                      <CInput
                        required
                        type="number"
                        id="quantity"
                        value={item.quantity}
                        onChange={(e) => props.onItemChange(idx, "quantity")(e.target.value)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CButton
                  onClick={() => props.onItemDelete(idx)}
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
          onClick={props.onItemAdd}
        >
          + Add Item
        </CButton>
      </CCol>
    </CRow>
  )
}