//#region Импорт модулей
import { initializeArrays } from '../../actions/mainActions'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import NameInput from '../common/NameInput'
import CreateQuerrie from './CreateQuerrie'
import Loading from '../common/Loading'
import Tags from '../common/Tags'
import Query from './Query'

import { updateDashboards } from '../../actions/mainActions'
import { sendUpdateDashboard, sendUpdateQueries, sendUpdateVisualization, sendSetVisualizationsList } from '../../actions/sendPostActions'
//#endregion


async function sendButtonHandler(dashboard) {
    await sendUpdateVisualization()
    await sendSetVisualizationsList(dashboard.slug)
    await sendUpdateQueries()
    await sendUpdateDashboard()
    initializeArrays(dashboard.id)
}

function DashboardEditor(props) {
    const dashboard = props.dashboardsArray.filter(d => d.slug == props.match.params.dashboardSlug)[0]
    const url = dashboard.public_url ? dashboard.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null

    const [firstLoad, setLoad] = useState(true)

    useEffect(() => {
        if (firstLoad) {
            initializeArrays(dashboard.id)
            setLoad(false)
        }
    })

    if (props.isLoading)
        return (<Loading />)
    return (
        <div style={{ marginTop: "2rem" }}>
            <Link to={props.path}>Назад</Link>
            <NameInput
                name={[
                    dashboard.newName,
                    n => { updateDashboards({ ...dashboard, newName: n, updated: true }) }
                ]}
            />
            {url ?
                <label style={{ marginRight: "5px" }}>Ссылка: <a href={url}>Dashboard</a></label> :
                <button className="edit-button">Опубликовать</button>
            }
            <Tags
                tags={[
                    dashboard.newTags,
                    newTags => updateDashboards({ ...dashboard, ...newTags, updated: true })
                ]}
            />
            <div className="mt1">
                <label>Queries:</label>
                {props.queries.map(q =>
                    <Query
                        key={q.id}
                        q={q}
                    />
                )}
            </div>
            <button className="mt1" onClick={() => { sendButtonHandler(dashboard) }}>Сохранить изменения</button>
            <CreateQuerrie />
        </div>
    )
}

const mapStateToProps = state => ({
    dashboardsArray: state.main.dashboardsArray,
    isLoading: state.main.isLoading,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps)(DashboardEditor)