import React from 'react'
import { updateDashboardsResponse } from '../../actions/postActions'

function Visualization(props) {
    return (
        <div className="row">
            <input
                onChange={e => {
                    const newV = props.d.updateVisualizations(props.v.id)
                    updateDashboardsResponse({ ...props.d, newVisualizations: newV })
                }}
                checked={props.v.inDashboard}
                type="checkbox"
            />
            <p className="ml1">{props.v.name}</p>
        </div>
    )
}

export default Visualization
