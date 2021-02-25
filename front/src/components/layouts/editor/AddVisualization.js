import React, { useState } from 'react'

const LINE = [
    'Traffic', 'Gpps', 'sessions', 'devices', 'aps',
]

const MAP_LINE = ['Map']

function AddVisualization(props) {
    const [name, updateName] = useState('Новая визуализация')
    const [line, updateLine] = useState(LINE[0])
    return (
        <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                <label>Название: </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Название"
                    value={name}
                    onChange={e => updateName(e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                <label>Шаблон: </label>
                <select
                    style={{ width: "250px" }}
                    value={line}
                    onChange={e => { updateLine(e.target.value) }}>
                    {props.map === true ?
                        MAP_LINE.map(k => <option key={k} value={k}>{k}</option>) :
                        LINE.map(k => <option key={k} value={k}>{k}</option>)
                    }
                </select>
            </div>
            <button onClick={() => props.sendNewVisual(name, line)} style={{ marginTop: "5px" }}>Создать</button>
        </div>
    )
}

export default AddVisualization
