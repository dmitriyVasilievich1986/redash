import getChangedArray from '../common/getChangedArray'
import React from 'react'

function Visualizations(props) {
    const [visualizations, updateVisualization] = props.visualizations

    const onChangeHandler = () => {
        const newVisual = {
            ...props.v,
            updated: true,
            inDashboard: !props.v.inDashboard,
        }
        updateVisualization(getChangedArray(visualizations, newVisual))
    }

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <input
                style={{ marginRight: "5px" }}
                checked={props.v.inDashboard}
                onChange={onChangeHandler}
                type="checkbox"
            />
            <p>{props.v.name}</p>
        </div>
    )
}

export default Visualizations
