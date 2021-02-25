import React from 'react'

import { filterArray } from '../../actions/mainActions'
import { connect } from 'react-redux'
import Dashboard from './Dashboard'
import Loading from './Loading'

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
        </div>
    )
}

const mapStateToProps = state => ({
    filteredArray: state.main.filteredArray,
    isLoading: state.main.isLoading,
    tag: state.main.tag,
})

export default connect(mapStateToProps, { filterArray })(DashboardList)