import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDashboards } from '../../actions/mainActions'
import sendPostData from '../common/sendPostData'
import Visualizations from './Visualizations'
import Tags from '../common/Tags'

function getQueriesIDFromTags(tags, queries) {
    // парсим тэги от этого дашборда, чтобы узнать есть ли тэг с название querie_id. Вытаскиваем данный id.
    const queriesID = tags.filter(t => t.match(/querie_/) != null).map(t => parseInt(t.match(/querie_.*/g)[0].replace('querie_', '')))
    return queries.filter(q => queriesID.indexOf(q.id) >= 0)
}

function getVisualizations(queriesFromDashboard, dashboard) {
    // из всех querie запросов вытягиваем визуализации, которые принадлежат этому дашборду
    const dashboardVisualizations = dashboard.widgets.map(w => w.visualization.id)
    const visualizations = []
    queriesFromDashboard.map(q => q.visualizations.map(
        v => {
            visualizations.push({
                ...v,
                updated: false,
                inDashboard: dashboardVisualizations.indexOf(v.id) >= 0,
            })
        }
    ))
    return visualizations
}

function Dashboard(props) {
    const [updated, setUpdated] = useState(false)
    // получаем визуализации, принадлежащие только этому дашборду
    const queriesFromDashboard = getQueriesIDFromTags(props.d.tags, props.queries)
    const [visualizations, updateVisualization] = useState(getVisualizations(queriesFromDashboard, props.d))
    // создаем хук для тегов этого борда. Вытягиваем ссылку на дашборд, если он опубликован
    const [tags, updateTags] = useState([...props.d.tags])
    const url = props.d.public_url ? props.d.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null

    //#region Отправить данные на api для изменения этого дашборда

    const sendDataToChange = e => {
        e.preventDefault()
        // добавить, убрать визуализации для этого дашборда
        sendUpdateVisualisation()
        // отправить данные для изменения дашборда. имя, тэги
        sendUpdateDashboard()
    }
    const sendUpdateDashboard = () => {
        const context = {
            method: 'update_dashboard',
            name: props.d.name,
            id: props.d.id,
            tags: tags,
        }
        sendPostData(context, props.updateDashboards, updated)
        setUpdated(false)
    }
    const sendUpdateVisualisation = () => {
        const visualArray = visualizations.filter(v => v.inDashboard).map(v => v.id)
        const context = {
            method: 'set_visualization_list',
            visualization_list: visualArray,
            slug: props.d.slug,
        }
        sendPostData(context, props.updateDashboards, visualizations)
        visualizations.map(v => { return { ...v, updated: false } })
    }

    //#endregion

    return (
        <div className='dashboard'>
            <h3>"{props.d.name}"</h3>
            {url ?
                <div className="row">
                    <p style={{ marginRight: '3px' }}>Ссылка на</p><a href={url}>dashboard</a>
                </div>
                : ''}
            <Tags
                tags={[tags, updateTags]}
                username={props.username}
                updated={setUpdated}
            />
            {visualizations.map(v => <Visualizations visualizations={[visualizations, updateVisualization]} key={v.id} v={v} />)}
            {props.username == 'admin' ?
                <div>
                    <Link className='edit-button' role='button' to='#' onClick={sendDataToChange}>Сохранить изменения</Link>
                    <Link className='edit-button' role='button' to={`${props.path}edit/${props.d.slug}/`}>Редактировать</Link>
                </div>
                : ''}
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.main.username,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps, { updateDashboards })(Dashboard)