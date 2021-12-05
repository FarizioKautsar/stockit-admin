const initState = [
  { 
    id: "ERHA123", 
    title: "Lorem Ipsum 1",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Non tellus orci ac auctor augue. Quis eleifend quam adipiscing vitae 
      proin sagittis nisl rhoncus mattis.`,
    xDim: 34,
    yDim: 34,
    zDim: 34,
    shelfId: "A14315",
    warehouseId: "HUHA15463",
    status: "shelved",
    items: [
      "318573875",
      "315983955",
      "346467384",
    ]
  }, { 
    id: "ERHA124", 
    title: "Lorem Ipsum 2",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Non tellus orci ac auctor augue. Quis eleifend quam adipiscing vitae 
      proin sagittis nisl rhoncus mattis.`,
    xDim: 23,
    yDim: 21,
    zDim: 22,
    shelfId: "A14316",
    warehouseId: "HUHA15463",
    status: "shelved",
    items: [
      "313433875",
      "935934955",
    ]
  }, { 
    id: "ERHA126", 
    title: "Lorem Ipsum 2",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Non tellus orci ac auctor augue. Quis eleifend quam adipiscing vitae 
      proin sagittis nisl rhoncus mattis.`,
    xDim: 56,
    yDim: 36,
    zDim: 33,
    shelfId: "A14317",
    warehouseId: "HUHA15463",
    status: "shelved",
    items: [
      "318573875",
      "315983955",
      "346467384",
      "546464383",
      "346467384",
    ]
  },
]

const packagesReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PACKAGE": 
      return state;
    case "CREATE_PACKAGE_ERROR": 
      return state;
    default:
      return state;
  }
}

export default packagesReducer;