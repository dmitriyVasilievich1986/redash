import React from 'react'
import ReactDOM from 'react-dom'
import { Refresh, QueryData, Visualization, DashboardList, DashboardEditor } from './layouts'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

export default function App() {
    return (
        <div className='container'>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={DashboardList} />
                    <Route exact path="/dashboard/:slug" component={DashboardEditor} />
                </Switch>
            </BrowserRouter>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))