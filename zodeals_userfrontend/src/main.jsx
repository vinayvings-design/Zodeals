import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import ErrorBoundary from './Components/libs/ErrorBoundary'
import AppLoader from './Components/libs/AppLoader'

function Root() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <AppLoader onFinish={() => setLoading(false)} />}
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary showError>
      <Root />
    </ErrorBoundary>
  </BrowserRouter>
)
