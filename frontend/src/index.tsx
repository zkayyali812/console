/* Copyright Contributors to the Open Cluster Management project */
/* istanbul ignore file */

import '@patternfly/react-core/dist/styles/base.css'
import { AcmHeader, AcmRoute } from '@open-cluster-management/ui-components'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <React.Suspense fallback={<AcmHeader route={AcmRoute.ClusterManagement} />}>
                <App />
            </React.Suspense>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
