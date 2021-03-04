import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import TYPE_ACTIONS from './actions/types'
import getContext from './layouts/common/getContext.ts'
import axios from 'axios'
import { DashboardList, DashboardEditor } from './layouts'


const currentPath = window.location.pathname

function setIsLoading(isLoading) {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_STATE,
        payload: { isLoading: isLoading },
    })
}

function sendPostData(method, type) {
    const [contextData, headers] = getContext({ method: method })

    axios.post(currentPath, contextData, headers)
        .then(data => {
            if (data.data.message) {
                console.log(data.data.message)
                setIsLoading(false)
            } else if (data.data.payload) {
                store.dispatch({
                    type: type,
                    payload: data.data.payload
                })
            }
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
}

function App() {
    useEffect(() => {
        // setIsLoading(false)
        setIsLoading(true)
        sendPostData('get_user', TYPE_ACTIONS.UPDATE_STATE)
        sendPostData('get_all_queries', TYPE_ACTIONS.UPDATE_QUERIES)
        sendPostData('get_all_dashboards', TYPE_ACTIONS.UPDATE_DASHBOARDS)
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