import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { icons } from './assets/icons'

import { Provider, useSelector } from 'react-redux'
import { isLoaded, ReactReduxFirebaseProvider } from 'react-redux-firebase';
import rootReducer from './store/reducers/rootReducer';
import { applyMiddleware, compose, createStore } from 'redux';
import { createFirestoreInstance, reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase,  getFirebase, reduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import { firebase, firebaseConfig } from './utils/firebase';

React.icons = icons

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      thunk.withExtraArgument({
        getFirebase, 
        getFirestore
      })
    ),
    reduxFirestore(firebase, firebaseConfig),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  ),
);

const profileConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
}

const rrfProps = {
  firebase,
  config: profileConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
}

function AuthReady(props) {
  const auth = useSelector(store => store.firebase.auth);
  if (!isLoaded(auth)) {
    return (
      <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
      </div>
    );
  } else {
    return props.children;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider { ...rrfProps }>
        <AuthReady>
          <App/>
        </AuthReady>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

