import React from 'react'

import { updateDashboards, updateProperties } from '../../actions/mainActions'
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
                    onChange={e => props.updateProperties({ tag: e.target.value })}
                    placeholder="Тэг или название"
                    value={props.tag}
                    type="text"
                />
            </div>
            {props.dashboards.map(
                d => <Dashboard key={d.id} d={d} />
            )}
            {props.username == adminName ? <AddDashboard /> : ""}
        </div>
    )
}

const mapStateToProps = state => ({
    dashboards: state.main.filteredDashboardsArray,
    isLoading: state.main.isLoading,
    username: state.main.username,
    tag: state.main.tag,
})

export default connect(mapStateToProps, { updateDashboards, updateProperties })(DashboardList)