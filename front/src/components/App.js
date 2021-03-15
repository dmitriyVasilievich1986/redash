//#region Импорт модулей
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './store'

import { updateQueriesResponse, updateDashboardsResponse, updateProperties } from './actions/postActions'
import { DashboardList, DashboardEditor, Manager } from './layouts'
import sendPostData from './layouts/common/sendPostData'
//#endregion

const currentPath = window.location.pathname

function loadDataFromServer(updateUsername) {
    updateProperties({ isLoading: true })
    sendPostData({ method: 'get_user' })
        .then(username => {
            updateUsername(username)
            updateProperties({ username: username })
        })
        .catch(err => console.log(err))
    sendPostData({ method: 'get_all_queries' })
        .then(queries => Promise.all(queries.results?.map(q => sendPostData({ method: 'get_querie', id: q.id }))))
        .then(allQueries => {
            allQueries?.map(q => updateQueriesResponse(q, true))
            return sendPostData({ method: 'get_dashboards' })
        })
        .then(dashboards => Promise.all(dashboards.results?.map(d => sendPostData({ method: 'get_dashboard', id: d.slug }))))
        .then(allDashboards => {
            allDashboards?.map(nd => updateDashboardsResponse(nd))
            updateProperties({ isLoading: false })
        })
}


function App() {
    const [username, updateUsername] = useState('')
    const [firstLoad, updateLoad] = useState(true)
    useEffect(() => {
        if (firstLoad) {
            loadDataFromServer(updateUsername)
            updateLoad(false)
        }
    })
    return (
        <Provider store={store}>
            <div className='container'>
                <BrowserRouter>
                    <Switch>
                        {username == ROLES.admin || username == ROLES.manager ?
                            <Route
                                exact path={currentPath}
                                component={username == ROLES.admin ? DashboardList : Manager}
                            /> :
                            ""}
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