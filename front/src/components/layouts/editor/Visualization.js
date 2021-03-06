import { updateVisualizations } from '../../actions/mainActions'
import React from 'react'

function Visualization(props) {
    const visualizationUpdateHandler = newVisualization => {
        const v = { ...props.v, ...newVisualization, updated: true }
        updateVisualizations(props.q, v)
    }
    return (
        <div style={{ marginTop: "5px" }}>
            <div className="row">
                <input
                    onChange={() => visualizationUpdateHandler({ inDashboard: !props.v.inDashboard })}
                    style={{ marginRight: "5px" }}
                    checked={props.v.inDashboard}
                    type="checkbox"
                />
                <input
                    onChange={e => visualizationUpdateHandler({ newName: e.target.value })}
                    className="form-control"
                    value={props.v.newName}
                    placeholder="Название"
                    type="text"
                />
            </div>
        </div>
    )
}

export default Visualization