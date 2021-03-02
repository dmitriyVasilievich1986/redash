import React, { useState } from 'react'
import Visualization from './Visualization'
import AddVisualization from './AddVisualization'
import sendPostData from '../common/sendPostData'
import { connect } from 'react-redux'
import { setIsLoading, updateVisualizations } from '../../actions/mainActions'

const CONTRACTS_ID = {
    'ООО "Ингка Сентерс Рус Оперэйшн"': "SF139",
    'ООО "Леруа Мерлен Восток"': "KI036",
    'АО "Авиакомпания "Сибирь"': "H6086",
    'ООО "Русфинанс Банк", ООО': "VE722",
    'МЕТРО Кэш энд Керри, ООО': "O6138",
    'ООО "БизнесБас", ООО': "LF414",
    'ООО "Алькор и Ко"': "P2172",
    'Кофе Сирена, ООО': "HU606",
    'ОКТОБЛУ, ООО': "FE744",
    'ПАО Росбанк': "IL405",
}

function extractContractID(query) {
    const match = query.match(/CONTRACT_ID='.*?'/g)
    const parsedQuery = match ? match.map(m => m.replaceAll(/CONTRACT_ID='|'/g, ''))[0] : null
    return parsedQuery
}

function Query(props) {
    const [queryString, updateQueryString] = useState(extractContractID(props.q.query))
    const [show, updateShow] = useState(false)
    const map = props.q.query.match(/GPS_LONGITUDE/g)
    const sendNewVisual = (newName, newLine) => {
        const context = {
            template: map === null ? 'line' : 'map',
            method: 'set_new_visualization',
            id: props.q.id,
            name: newName,
            line: newLine,
        }
        const addVisual = data => {
            props.updateQueries([{
                id: props.q.id,
                visualizations: [...props.q.visualizations, data]
            }])
            // props.updateVisual(data)
            props.updateVisualizations([data])
        }
        sendPostData(props.path, context, addVisual, props.setIsLoading)
    }
    const sendRefreshQuerrie = () => {
        const context = {
            method: "post_refresh_querrie",
            id: props.q.id,
        }
        sendPostData(props.path, context, () => { props.setIsLoading(false) }, props.setIsLoading)
    }
    return (
        <div className="querie">
            <div className="querie-header" onClick={() => updateShow(!show)}>{props.q.name}</div>
            <div style={show ? { marginLeft: '1rem' } : { marginLeft: "1rem", display: 'none' }}>
                <button onClick={sendRefreshQuerrie} className="edit-button">Обновить</button>
                <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <label style={{ marginRight: "5px" }}>Название:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Название"
                        value={props.q.name}
                        onChange={e => props.updateQueries([{ id: props.q.id, updated: true, name: e.target.value }])} />
                </div>
                {queryString ?
                    <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                        <label style={{ marginRight: "5px" }}>Выбор шаблона:</label>
                        <select
                            style={{ width: "250px" }}
                            value={queryString}
                            onChange={e => {
                                updateQueryString(e.target.value)
                                const newQuery = props.q.query.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${e.target.value}'`)
                                props.updateQueries([{ id: props.q.id, updated: true, query: newQuery }])
                            }}>
                            {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={CONTRACTS_ID[k]}>{k}</option>)}
                        </select>
                    </div>
                    : ""}
                <div style={{ marginTop: "1rem" }}>
                    <label>Визуализации:</label>
                    {props.q.visualizations.map(v =>
                        <Visualization updateVisual={props.updateVisual} key={v.id} v={v} />
                    )}
                </div>
                {queryString ? <AddVisualization map={map !== null} sendNewVisual={sendNewVisual} /> : ""}
                <div style={{ marginBottom: "1rem" }} />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    path: state.main.path,
})

export default connect(mapStateToProps, { setIsLoading, updateVisualizations })(Query)