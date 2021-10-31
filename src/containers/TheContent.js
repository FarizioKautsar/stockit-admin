import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'

// routes config
import routes from '../routes'
import { useSelector } from 'react-redux'
import { isEmpty, isLoaded, useFirebase, useFirestoreConnect } from 'react-redux-firebase'
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const TheContent = () => {
  const history = useHistory();
  const auth = useSelector(state => state.firebase.auth)

  if (auth?.isLoaded && auth?.isEmpty) {
    history.replace("/login");
  }

  useFirebase();
  const profile = useSelector(state => state.firebase.profile);
 
  useFirestoreConnect(() => [
    { collection: "companies", doc: profile.companyId }
  ])

  return (
    <main className="c-main">
      <CContainer fluid>
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                    <CFade>
                      <route.component {...props} />
                    </CFade>
                  )} />
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  )
}

export default React.memo(TheContent)
