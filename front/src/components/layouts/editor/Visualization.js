import React from 'react'

function Visualization(props) {
    return (
        <div style={{ marginTop: "5px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    style={{ marginRight: "5px" }}
                    type="checkbox"
                    onChange={() => props.updateVisual({ id: props.v.id, inDashboard: !props.v.inDashboard })}
                    checked={props.v.inDashboard} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Название"
                    value={props.v.name}
                    onChange={e => props.updateVisual([{
                        id: props.v.id,
                        name: e.target.value,
                        updated: true,
                    }])} />
            </div>
        </div>
    )
}

export default Visualization