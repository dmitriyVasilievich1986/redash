import React, { useState } from 'react'
import getChangedArray from '../common/getChangedArray'

function Visualizations(props) {
    const [check, updateCheck] = useState(props.v.inDashboard)
    const [visualizations, updateVisualization] = props.vis
    const onChangeHandler = () => {
        const newVisual = { ...props.v, inDashboard: !props.v.inDashboard, updated: true }
        updateVisualization(getChangedArray(visualizations, [newVisual]))
    }
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                style={{ marginRight: "5px" }}
                type="checkbox"
                onChange={onChangeHandler}
                checked={props.v.inDashboard} />
            <p>{props.v.name}</p>
        </div>
    )
}

export default Visualizations
