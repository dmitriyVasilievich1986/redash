import { updateDashboards, updateQueries } from '../../actions/mainActions'
import sendPostData from '../common/sendPostData'
import React, { useState } from 'react'
import { connect } from 'react-redux'


const QUERY_LIST = {
    'map': "select max(Time) as last_activity, concat (CITY_R, ', ', ADDRESS) as PointAddress, round(GPS_LONGITUDE, 2) as lon, round(GPS_LATITUDE, 2) as lat, multiIf (ceil(log(ceil((now() - max(Time))/900)))=0, '1 activity < 15 mins', ceil(log(ceil((now() - max(Time))/900)))=1, '2 activity < 30 mins', ceil(log(ceil((now() - max(Time))/900)))=2, '3 activity < 2 hours', ceil(log(ceil((now() - max(Time))/900)))=3, '4 activity < 5 hours', ceil(log(ceil((now() - max(Time))/900)))=4, '5 activity < 9 hours', ceil(log(ceil((now() - max(Time))/900)))=5, '6 activity < 2 days', ceil(log(ceil((now() - max(Time))/900)))=6, '7 activity < 4 days', '8 activity > 4 days') as Layer from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and (Time>now()-INTERVAL 7 DAY) and CONTRACT_ID='P2172' group by CITY_R, ADDRESS, lon,lat order by Layer",
    'chart': "select Time as DateTime, concat (CITY_R, ', ', ADDRESS) as PointAddress, (sum(AcctInputOctets) + sum(AcctOutputOctets))/1024/1024/1024 as Traffic, (sum(AcctInputOctets) + sum(AcctOutputOctets))*8/1024/1024/1024/900 as Gpps, uniq(AcctSessionId) as sessions, uniq(CallingStationId) as devices, uniq(NASIPAddress) as aps from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and CONTRACT_ID='LF414' and (Time>now()-INTERVAL 3 DAY) group by DateTime, PointAddress order by aps, devices desc, Traffic desc, Gpps",
}

function AddDashboard(props) {
    const [template, updateTemplate] = useState(Object.keys(CONTRACTS_ID)[0])
    const [name, updateName] = useState('новый борд')

    const sendAddNewDashboard = () => {
        const map = QUERY_LIST.map.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${template}'`)
        const chart = QUERY_LIST.chart.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${template}'`)
        const context = {
            method: 'create_dashboard',
            chart: chart,
            name: name,
            map: map,
        }
        sendPostData(
            context,
            p => {
                props.updateQueries(p.chart)
                props.updateQueries(p.map)
                props.updateDashboards(p.dashboard)
            }
        )
    }

    return (
        <div style={{ marginTop: '2rem', borderTop: "1px solid black", marginTop: "2rem" }}>
            <div style={{ marginTop: "1rem" }}>
                <label style={{ marginRight: "5px" }}>Создать новый борд:</label>
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
            <div style={{ marginTop: "5px" }} className='row'>
                <label style={{ marginRight: "5px" }}>Шаблон:</label>
                <select
                    style={{ width: "350px" }}
                    value={template}
                    onChange={e => { updateTemplate(e.target.value) }}>
                    {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={k}>{CONTRACTS_ID[k]}</option>)}
                </select>
            </div>
            <button onClick={sendAddNewDashboard} className="edit-button">Создать</button>
        </div>
    )
}

export default connect(null, { updateDashboards, updateQueries })(AddDashboard)
