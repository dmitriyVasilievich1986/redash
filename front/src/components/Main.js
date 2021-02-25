import React from 'react'
import { connect } from 'react-redux'
import { DashboardList, DashboardEditor } from './layouts'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


function Main(props) {
    const currentPath = window.location.pathname
    if (props.isLoading)
        return (<Backdrop open={true}>
            <CircularProgress color="inherit" />
        </Backdrop>)
    return (
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
    )
}

const mapStateToProps = state => ({
    isLoading: state.main.isLoading,
})

export default connect(mapStateToProps)(Main)
