import React from 'react'

function NameInput(props) {
    const [name, updateName] = props.name
    return (
        <div style={{ marginTop: "1rem" }}>
            <label>Название:</label>
            <input
                type="text"
                className="form-control"
                placeholder="Название"
                value={name}
                onChange={e => updateName(e.target.value)}
            />
        </div>
    )
}

export default NameInput
