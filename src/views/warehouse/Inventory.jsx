import { CButton, CCard, CCardBody, CCardHeader, CCol, CDataTable, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalHeader, CRow, CSelect } from '@coreui/react';
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useParams } from 'react-router-dom'
import { createItems } from 'src/store/actions/warehouseActions';

function InventoryAddItems(props) {
  const {show, onClose, warehouseId} = props;
  const profile = useSelector(state => state.firebase.profile);
  const dispatch = useDispatch();

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        {
          collection: "warehouses",
          doc: warehouseId,
          subcollections: [
            { collection: "shelves" }
          ]
        }
      ],
      storeAs: "shelves"
    },
  ])

  const firestoreState = useSelector(state => state.firestore);
  const products = firestoreState.data.products;

  const [items, setItems] = useState([]);

  function handleItemAdd() {
    setItems(items.concat([{
      id: "",
      quantity: "",
      name: "",
      shelfId: ""
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

  const shelves = useSelector(state => state.firestore.ordered.shelves);

  async function handleSubmit() {
    await dispatch(createItems({ warehouseId, items }));
    onClose();
  }

  return (
    <CModal
      show={show}
      onClose={onClose}
    >
      <CModalHeader>
        <h3>Add Items</h3>
      </CModalHeader>
      <CModalBody>
        {
          items.map((item, idx) => (
            <CCard>
              <CCardBody className="d-flex align-items-center">
                <CRow>
                  <CCol xs={8}>
                    <CFormGroup>
                      <CLabel htmlFor="productId">Product</CLabel>
                      <CInput
                        required
                        id="productId"
                        value={item.id}
                        onChange={(e) => handleItemChange(idx, "id")(e.target.value)}
                      />
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
                        onChange={(e) => handleItemChange(idx, "quantity")(e.target.value)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol xs={12}>
                    <CFormGroup>
                      <CLabel htmlFor="name">Product Name</CLabel>
                      <CInput
                        required
                        id="name"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, "name")(e.target.value)}
                      />
                    </CFormGroup>
                  </CCol>
                  {
                    shelves && (
                      <CCol xs={12}>
                        <CFormGroup>
                          <CLabel htmlFor="name">Store in Shelf</CLabel>
                          <CSelect
                            defaultValue="0"
                            value={item.shelfId}
                            onChange={(e) => handleItemChange(idx, "shelfId")(e.target.value)}
                          >
                            <option value="0" disabled>-- Select Shelf --</option>
                            {
                              shelves?.map(shelf => (
                                <option value={shelf?.id}>{shelf?.id}</option>
                              ))
                            }
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                    )
                  }
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
          Add Item
        </CButton> 
        <CButton color="primary" className="w-100 mt-3" onClick={handleSubmit}>
          Commit Store
        </CButton>
      </CModalBody>
    </CModal>
  )
}


export default function Inventory() {
  const warehouseId = useParams().warehouseId;
  const profile = useSelector(state => state.firebase.profile);
  const [showAddItems, setShowAddItems] = useState(false);

  useFirestoreConnect([
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        {
          collection: "warehouses",
          doc: warehouseId
        }
      ],
      storeAs: "warehouses"
    },
    {
      collection: "companies",
      doc: `${profile.companyId}`,
      subcollections: [
        {
          collection: "products",
        }
      ],
      storeAs: "products"
    },
  ])

  const firestoreState = useSelector(state => state.firestore);
  const products = firestoreState.data.products;
  const warehouse = firestoreState.ordered.warehouses?.[0];
  const shelves = firestoreState.ordered.shelves;

  return (
    <div>
      <InventoryAddItems 
        show={showAddItems}
        onClose={() => setShowAddItems(false)}
        warehouseId={warehouseId}
        // onAddPackage={handleAddPackage}
      />
      <CCard>
        <CCardHeader className="d-flex">
          <h3>Inventory</h3>
          <CButton className="ml-auto"
            color="primary"
            variant='outline'
            onClick={() => setShowAddItems(true)}
          >
            Add Items
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={shelves?.filter(s => s.items?.length > 0)}
            loading={!isLoaded(shelves)}
            fields={[
              { key: "id", label: "Shelf"},
              "items"
            ]}
            scopedSlots={{
              items: (s) => (
                <td>
                  <CDataTable
                    items={s?.items}
                    fields={[
                      "name",
                      "quantity"
                    ]}
                    scopedSlots={{
                      name: (i) => (
                        <td>
                          {products?.[i.id]?.name}
                        </td>
                      )
                    }}
                  />
                </td>
              )
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  )
}
