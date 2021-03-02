import React from 'react'

import { filterArray, setIsLoading, addNewDashboard } from '../../actions/mainActions'
import { connect } from 'react-redux'
import Dashboard from './Dashboard'
import Loading from './Loading'
import AddDashboard from './AddDashboard'

function DashboardList(props) {
    if (props.isLoading)
        return (<Loading />)
    return (
        <div>
            <div className="input-group">
                <span style={{ marginRight: "1rem" }}>Фильтр по тэгам или имени:</span>
                <input
                    type="text"
                    placeholder="Тэг или название"
                    value={props.tag}
                    onChange={props.filterArray}
                />
            </div>
            {props.filteredArray.map(
                d => <Dashboard key={d.id} d={d} />
            )}
            {props.username == 'admin' ? <AddDashboard /> : ""}
        </div>
    )
}

const mapStateToProps = state => ({
    filteredArray: state.main.filteredArray,
    isLoading: state.main.isLoading,
    username: state.main.username,
    tag: state.main.tag,
})

export default connect(mapStateToProps, { filterArray, setIsLoading, addNewDashboard })(DashboardList)