import React, { useState } from 'react'
import sendPostData from '../common/sendPostData'
import { connect } from 'react-redux'
import { setIsLoading, addNewDashboard } from '../../actions/mainActions'

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
const QUERY_LIST = {
    'map': "select max(Time) as last_activity, concat (CITY_R, ', ', ADDRESS) as PointAddress, round(GPS_LONGITUDE, 2) as lon, round(GPS_LATITUDE, 2) as lat, multiIf (ceil(log(ceil((now() - max(Time))/900)))=0, '1 activity < 15 mins', ceil(log(ceil((now() - max(Time))/900)))=1, '2 activity < 30 mins', ceil(log(ceil((now() - max(Time))/900)))=2, '3 activity < 2 hours', ceil(log(ceil((now() - max(Time))/900)))=3, '4 activity < 5 hours', ceil(log(ceil((now() - max(Time))/900)))=4, '5 activity < 9 hours', ceil(log(ceil((now() - max(Time))/900)))=5, '6 activity < 2 days', ceil(log(ceil((now() - max(Time))/900)))=6, '7 activity < 4 days', '8 activity > 4 days') as Layer from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and (Time>now()-INTERVAL 7 DAY) and CONTRACT_ID='P2172' group by CITY_R, ADDRESS, lon,lat order by Layer",
    'chart': "select Time as DateTime, concat (CITY_R, ', ', ADDRESS) as PointAddress, (sum(AcctInputOctets) + sum(AcctOutputOctets))/1024/1024/1024 as Traffic, (sum(AcctInputOctets) + sum(AcctOutputOctets))*8/1024/1024/1024/900 as Gpps, uniq(AcctSessionId) as sessions, uniq(CallingStationId) as devices, uniq(NASIPAddress) as aps from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and CONTRACT_ID='LF414' and (Time>now()-INTERVAL 3 DAY) group by DateTime, PointAddress order by aps, devices desc, Traffic desc, Gpps",
}

function AddDashboard(props) {
    const [name, updateName] = useState('новый борд')
    const [template, updateTemplate] = useState(CONTRACTS_ID[Object.keys(CONTRACTS_ID)[0]])
    const sendAddNewDashboard = () => {
        const map = QUERY_LIST.map.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${template}'`)
        const chart = QUERY_LIST.chart.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${template}'`)
        const context = {
            method: 'create_dashboard',
            chart: chart,
            name: name,
            map: map,
        }
        sendPostData(props.path, context, props.addNewDashboard, props.setIsLoading)
    }
    return (
        <div style={{ marginTop: '2rem', borderTop: "1px solid black", marginTop: "2rem" }}>
            <div style={{ marginTop: "1rem" }}>
                <label>Создать новый борд:</label>
            </div>
            <div style={{ marginTop: "1rem" }}>
                <label>Название:</label>
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
                    style={{ width: "350px" }}
                    value={template}
                    onChange={e => { updateTemplate(e.target.value) }}>
                    {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={CONTRACTS_ID[k]}>{k}</option>)}
                </select>
            </div>
            <button onClick={sendAddNewDashboard} className="edit-button">Создать</button>
        </div>
    )
}

const mapStateToProps = state => ({
    path: state.main.path,
})

export default connect(mapStateToProps, { setIsLoading, addNewDashboard })(AddDashboard)
