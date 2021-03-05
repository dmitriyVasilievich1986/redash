import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './store'
import axios from 'axios'

import { DashboardList, DashboardEditor } from './layouts'
import getContext from './layouts/common/getContext.ts'
import TYPE_ACTIONS from './actions/types'


const currentPath = window.location.pathname

function sendPostData(context, payloadFunction) {
    const [contextData, headers] = getContext(context)

    axios.post(currentPath, contextData, headers)
        .then(data => {
            if (data.data.message)
                console.log(data.data.message)
            else if (data.data.payload)
                payloadFunction(data.data.payload)
        })
        .catch(err => console.log(err))
}

function storeDispatch(type, payload) {
    store.dispatch({
        type: type,
        payload: payload,
    })
}

function App() {
    useEffect(() => {
        sendPostData(
            { method: 'get_user' },
            username => storeDispatch(TYPE_ACTIONS.UPDATE_STATE, { username: username })
        )
        sendPostData(
            { method: 'get_dashboards' },
            dashboards => dashboards.results?.map(d => {
                sendPostData(
                    { method: 'get_dashboard', id: d.slug },
                    db => storeDispatch(TYPE_ACTIONS.UPDATE_DASHBOARDS, db)
                )
            })
        )
        sendPostData(
            { method: 'get_all_queries' },
            queries => queries.results?.map(q => {
                sendPostData(
                    { method: 'get_querie', id: q.id },
                    sq => storeDispatch(TYPE_ACTIONS.UPDATE_QUERIES, sq)
                )
            })
        )
        storeDispatch(TYPE_ACTIONS.UPDATE_STATE, { isLoading: false })
    })
    return (
        <Provider store={store}>
            <div className='container'>
                <BrowserRouter>
                    <Switch>
                        <Route exact path={currentPath} component={DashboardList} />
                        <Route
                            exact path={`${currentPath}edit/:dashboardSlug`}
                            render={props => <DashboardEditor {...props} currentPath={currentPath} />}
                        />
                    </Switch>
                </BrowserRouter>
                <div style={{ marginTop: "5rem" }} />
            </div>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))