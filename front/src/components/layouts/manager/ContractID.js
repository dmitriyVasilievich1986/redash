import { updateDashboardsResponse, updateQueriesResponse, updateProperties } from '../../actions/postActions'
import sendPostData from '../common/sendPostData'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

// темплейт query строки, для запроса в БД.
const QUERY_LIST = {
    'map': "select max(Time) as last_activity, concat (CITY_R, ', ', ADDRESS) as PointAddress, round(GPS_LONGITUDE, 2) as lon, round(GPS_LATITUDE, 2) as lat, multiIf (ceil(log(ceil((now() - max(Time))/900)))=0, '1 activity < 15 mins', ceil(log(ceil((now() - max(Time))/900)))=1, '2 activity < 30 mins', ceil(log(ceil((now() - max(Time))/900)))=2, '3 activity < 2 hours', ceil(log(ceil((now() - max(Time))/900)))=3, '4 activity < 5 hours', ceil(log(ceil((now() - max(Time))/900)))=4, '5 activity < 9 hours', ceil(log(ceil((now() - max(Time))/900)))=5, '6 activity < 2 days', ceil(log(ceil((now() - max(Time))/900)))=6, '7 activity < 4 days', '8 activity > 4 days') as Layer from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and (Time>now()-INTERVAL 7 DAY) and CONTRACT_ID='P2172' group by CITY_R, ADDRESS, lon,lat order by Layer",
    'chart': "select Time as DateTime, concat (CITY_R, ', ', ADDRESS) as PointAddress, (sum(AcctInputOctets) + sum(AcctOutputOctets))/1024/1024/1024 as Traffic, (sum(AcctInputOctets) + sum(AcctOutputOctets))*8/1024/1024/1024/900 as Gpps, uniq(AcctSessionId) as sessions, uniq(CallingStationId) as devices, uniq(NASIPAddress) as aps from default.wifi_sessions, default.wifi_ap_history where NASIPAddress=INT_IP and CONTRACT_ID='LF414' and (Time>now()-INTERVAL 3 DAY) group by DateTime, PointAddress order by aps, devices desc, Traffic desc, Gpps",
}

function ContractID(props) {
    const [contractID, updateContractID] = useState("")
    const [error, updateError] = useState("")
    const findDashboardByID = () => {
        const db = props.dashboardsArray.filter(d => d.contractID.toLowerCase() == contractID.toLowerCase())?.[0]
        db && db.initialize()
        db ? props.updateDashboard(db.id) : sendAddNewDashboard()
    }

    //#region отправляем запрос на добавление нового дашборда
    const sendAddNewDashboard = () => {
        updateProperties({ isLoading: true })
        // Получем query строки с исправленным contract_id, для шаблона карты и графиков
        const map = QUERY_LIST.map.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${contractID.toUpperCase()}'`)
        const chart = QUERY_LIST.chart.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${contractID.toUpperCase()}'`)
        const context = {
            name: `ContractID_<${contractID.toUpperCase()}>`,
            contract_id: contractID.toUpperCase(),
            method: 'create_dashboard',
            chart: chart,
            map: map,
        }
        sendPostData(context)
            .then(p => {
                updateQueriesResponse(p.map, true)
                updateQueriesResponse(p.chart, true)
                updateDashboardsResponse(p.dashboard)
                props.updateDashboard(p.dashboard.id)
                updateProperties({ isLoading: false })
            })
            .catch(() => window.alert(`нет данных со значение ContractID "${contractID.toUpperCase()}"`))
    }
    //#endregion

    return (
        <div>
            <div className="row mt1">
                <label>Введите значение contract ID:</label>
                <input
                    onChange={e => {
                        updateError("")
                        updateContractID(e.target.value)
                    }}
                    className="ml1 mr1 form-control"
                    placeholder="ContractID"
                    value={contractID}
                    type="text"
                />
                <button onClick={findDashboardByID}>Найти</button>
            </div>
            <p style={{ color: "red" }}>{error}</p>
        </div>
    )
}

const mapStateToProps = state => ({
    dashboardsArray: state.main.dashboardsArray,
})

export default connect(mapStateToProps)(ContractID)
