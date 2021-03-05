import React, { useState } from 'react'
import NameInput from '../common/NameInput'

const LINE = [
    'Traffic', 'Gpps', 'sessions', 'devices', 'aps',
]

const MAP_LINE = ['Map']

function AddVisualization(props) {
    const [name, updateName] = useState('Новая визуализация')
    const [line, updateLine] = useState(LINE[0])

    return (
        <div style={{ marginTop: "1rem" }}>
            <NameInput name={[name, updateName]} />
            <div className='row mt1'>
                <label>Шаблон:</label>
                <select
                    value={line}
                    style={{ marginLeft: '5px', width: "250px" }}
                    onChange={e => { updateLine(e.target.value) }}>
                    {props.map === true ?
                        MAP_LINE.map(k => <option key={k} value={k}>{k}</option>) :
                        LINE.map(k => <option key={k} value={k}>{k}</option>)
                    }
                </select>
            </div>
            <button onClick={() => props.createVisualization(name, line)}>Создать</button>
        </div>
    )
}

export default AddVisualization
