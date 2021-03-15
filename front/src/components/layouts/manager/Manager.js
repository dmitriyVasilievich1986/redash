import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import ContractID from './ContractID'
import Loading from '../common/Loading'
import Dashboard from './Dashboard'

function Manager(props) {
    const [dashboard, updateDashboard] = useState(null)
    if (props.isLoading)
        return (<Loading />)
    return (
        <div>
            <ContractID updateDashboard={updateDashboard} />
            {props.dashboardsArray
                .filter(db => db.id == dashboard)
                .map(db => <Dashboard key={db.id} d={db} />)
            }
        </div>
    )
}

// Выгрузка состояний из redux store в параметры функции.
const mapStateToProps = state => ({
    dashboardsArray: state.main.dashboardsArray,
    isLoading: state.main.isLoading,
})

export default connect(mapStateToProps)(Manager)
