import React from 'react'

function Visualization(props) {
    const visualizationUpdateHandler = newVisualization => {
        const v = {
            ...props.v,
            ...newVisualization,
            updated: true
        }
        props.visualizationUpdate(v)
    }
    return (
        <div style={{ marginTop: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    onChange={() => visualizationUpdateHandler({ inDashboard: !props.v.inDashboard })}
                    style={{ marginRight: "5px" }}
                    checked={props.v.inDashboard}
                    type="checkbox"
                />
                <input
                    onChange={e => visualizationUpdateHandler({ name: e.target.value })}
                    className="form-control"
                    placeholder="Название"
                    value={props.v.name}
                    type="text"
                />
            </div>
        </div>
    )
}

export default Visualization