import { updateDashboards, updateQueries } from '../../actions/mainActions'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import sendPostData from '../common/sendPostData'
import CreateQuerrie from './CreateQuerrie'
import NameInput from '../common/NameInput'
import Loading from '../common/Loading'
import Tags from '../common/Tags'
import Query from './Query'



function getQueries(queries, dashboard) {
    const dashboardVisualizations = dashboard.widgets.map(w => w.visualization.id)
    const newQueries = queries.map(q => {
        return {
            ...q,
            newName: q.name,
            updatedQuery: null,
            visualizations: q.visualizations.map(v => {
                return {
                    ...v,
                    updated: false,
                    newName: v.name,
                    inDashboard: dashboardVisualizations.indexOf(v.id) >= 0,
                }
            })
        }
    })
    return newQueries
}

function DashboardEditor(props) {
    const dashboard = props.dashboardsArray.filter(d => d.slug == props.match.params.dashboardSlug)[0]

    const [url, updateURL] = useState(dashboard.public_url ? dashboard.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null)
    const [name, updateName] = useState(dashboard.name)
    const [tags, updateTags] = useState(dashboard.tags)
    const [updated, setUpdated] = useState(false)
    const [firstLoad, setLoad] = useState(true)

    useEffect(() => {
        if (firstLoad) {
            props.updateQueries(getQueries(props.queries, dashboard))
            setLoad(false)
        }
    })

    const discardUpdates = () => {
        const newQueries = props.queries.map(q => {
            return {
                ...q,
                updated: false,
                visualizations: q.visualizations.map(v => {
                    return {
                        ...v,
                        updated: false,
                    }
                })
            }
        })
        props.updateQueries(newQueries)
    }

    const sendButtonHandler = () => {
        sendUpdateVisualization()
        sendSetVisualizations()
        sendUpdateDashboard()
        sendUpdateQuerie()
        discardUpdates()
    }
    const sendUpdateDashboard = () => {
        const context = {
            method: 'update_dashboard',
            id: dashboard.id,
            name: name,
            tags: tags,
        }
        sendPostData(context, props.updateDashboards, updated)
        setUpdated(false)
    }
    const sendUpdateVisualization = () => {
        props.queries
            .map(q => q.visualizations.map(v => {
                if (!v.updated)
                    return
                const context = {
                    method: 'update_visualization',
                    name: v.newName,
                    querie_id: q.id,
                    id: v.id,
                }
                sendPostData(context, props.updateQueries)
            }))
    }
    const sendUpdateQuerie = () => {
        props.queries
            .filter(q => q.updated)
            .map(q => {
                const context = {
                    query: q.updatedQuery === null ? q.query : q.updatedQuery,
                    method: 'update_query',
                    name: q.newName,
                    id: q.id,
                }
                sendPostData(context, props.updateQueries)
            })
    }
    const sendSetVisualizations = () => {
        const visualizationsID = []
        let updatedVisualizations = false
        props.queries
            .map(q => q.visualizations.map(v => {
                if (v.updated)
                    updatedVisualizations = true
                if (v.inDashboard)
                    visualizationsID.push(v.id)
            }))
        const context = {
            visualization_list: visualizationsID,
            method: 'set_visualization_list',
            slug: dashboard.slug,
        }
        sendPostData(context, props.updateDashboards, updatedVisualizations)
    }
    if (props.isLoading)
        return (<Loading />)
    return (
        <div style={{ marginTop: "2rem" }}>
            <Link to={props.path}>Назад</Link>
            <NameInput name={[name, n => { updateName(n), setUpdated(true) }]} />
            {url ?
                <label style={{ marginRight: "5px" }}>Ссылка: <a href={url}>Dashboard</a></label> :
                <button className="edit-button">Опубликовать</button>
            }
            <Tags
                tags={[tags, updateTags]}
                username={props.username}
                updated={setUpdated}
            />
            <div className="mt1">
                <label>Queries:</label>
                {props.queries.map(q =>
                    <Query
                        queries={[props.queries, props.updateQueries]}
                        key={q.id}
                        q={q}
                    />
                )}
            </div>
            <button
                className="mt1"
                onClick={sendButtonHandler}
            >
                Сохранить изменения
                </button>
            <CreateQuerrie />
        </div>
    )
}

const mapStateToProps = state => ({
    dashboardsArray: state.main.dashboardsArray,
    isLoading: state.main.isLoading,
    username: state.main.username,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps, { updateDashboards, updateQueries })(DashboardEditor)