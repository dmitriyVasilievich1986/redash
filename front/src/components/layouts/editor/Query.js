import React, { useState } from 'react'
import Visualization from './Visualization'
import AddVisualization from './AddVisualization'
import sendPostData from '../common/sendPostData'
import getChangedArray from '../common/getChangedArray'
import { connect } from 'react-redux'
import { updateProperties, updateQueries } from '../../actions/mainActions'
import NameInput from '../common/NameInput'


function extractContractID(query) {
    const match = query.match(/CONTRACT_ID='.*?'/g)
    const parsedQuery = match ? match.map(m => m.replaceAll(/CONTRACT_ID='|'/g, ''))[0] : null
    return parsedQuery
}

function Query(props) {
    const [queryString, updateQueryString] = useState(extractContractID(props.q.query))
    const [name, updateName] = useState(props.q.name)
    const [queries, updateQueries] = props.queries
    const [show, updateShow] = useState(false)
    const map = props.q.query.match(/GPS_LONGITUDE/g) !== null

    const sendNewVisual = (newName, newLine) => {
        const context = {
            method: 'set_new_visualization',
            template: map ? 'map' : 'line',
            id: props.q.id,
            name: newName,
            line: newLine,
        }
        sendPostData(context, props.updateQueries)
    }
    const sendRefreshQuerrie = () => {
        const context = {
            method: "post_refresh_querrie",
            id: props.q.id,
        }
        sendPostData(context, () => { props.updateProperties({ isLoading: false }) })
    }
    const querieUpdateHandler = newQuerie => {
        const updatedQuerie = { ...props.q, updated: true, ...newQuerie }
        props.updateQueries(updatedQuerie)
    }
    const visualizationUpdateHandler = newVisualization => {
        const visualizations = getChangedArray(props.q.visualizations, newVisualization)
        const newQuerie = { ...props.q, visualizations: visualizations }
        querieUpdateHandler(newQuerie)
    }

    return (
        <div className="querie">
            <div className="querie-header" onClick={() => updateShow(!show)}>{props.q.name}</div>
            <div style={show ? { marginLeft: '1rem' } : { marginLeft: "1rem", display: 'none' }}>
                <button onClick={sendRefreshQuerrie} className="edit-button">Обновить</button>
                <NameInput name={[props.q.newName, n => querieUpdateHandler({ newName: n })]} />
                {queryString ?
                    <div className="row mt1">
                        <label style={{ marginRight: "5px" }}>Выбор шаблона:</label>
                        <select
                            style={{ width: "250px" }}
                            value={queryString}
                            onChange={e => {
                                updateQueryString(e.target.value)
                                const newQuery = props.q.query.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${e.target.value}'`)
                                querieUpdateHandler({ query: newQuery })
                            }}>
                            {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={k}>{CONTRACTS_ID[k]}</option>)}
                        </select>
                    </div>
                    : ""}
                <div style={{ marginTop: "1rem" }}>
                    <label>Визуализации:</label>
                    {props.q.visualizations.map(v =>
                        <Visualization key={v.id} v={v} visualizationUpdate={visualizationUpdateHandler} />
                    )}
                </div>
                {queryString ? <AddVisualization map={map} sendNewVisual={sendNewVisual} /> : ""}
                <div style={{ marginBottom: "1rem" }} />
            </div>
        </div>
    )
}

export default connect(null, { updateProperties, updateQueries })(Query)