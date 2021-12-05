// import { createStore, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk';
// import rootReducer from './store/reducers/rootReducer'
// import { compose } from 'redux';
// import { firebase, firebaseConfig, firestore } from './utils/firebase';
// import { createFirestoreInstance, reduxFirestore, getFirestore } from 'redux-firestore';
// import { reactReduxFirebase,  getFirebase, reduxFirebase } from 'react-redux-firebase';

// const store = createStore(
//   rootReducer,
//   compose(
//     applyMiddleware(
//       thunk.withExtraArgument({
//         getFirebase, 
//         getFirestore
//       })
//     ),
//     reduxFirestore(firebase, firebaseConfig),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   ),
// );

// store.firebaseAuthIsReady.then(() => {
  
// })

// const rrfProps = {
//   firebase,
//   config: firebaseConfig,
//   dispatch: store.dispatch,
//   createFirestoreInstance
// }

// export default store;
// export { rrfProps }
