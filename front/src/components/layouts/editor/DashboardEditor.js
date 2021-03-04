import { setIsLoading, updateDashboards, updateVisualizations, updateVisualArray, updateQueries, updateQuerie } from '../../actions/mainActions'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Query from './Query'
import Loading from '../common/Loading'
import getChangedArray from '../common/getChangedArray.ts'
import moduleName from './CreateQuerrie'
import NameInput from '../common/NameInput'

import Tags from '../common/Tags'
import sendPostData from '../common/sendPostData'
import CreateQuerrie from './CreateQuerrie'


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

    // const updateVisualizationHandler = newVisualization => {
    //     const visualizations = [...queries.map(q => {
    //         const newVis = getChangedArray(q.visualizations, [newVisualization])
    //         return {
    //             ...q,
    //             updated: false,
    //             visualizations: newVis,
    //         }
    //     })]
    //     updateQueries(visualizations)
    // }
    // const sendSetVisualizations = () => {
    //     const vizualArray = []
    //     queries.filter(q => q.visualizations).map(q => q.visualizations.map(v => { if (v.inDashboard) vizualArray.push(v.id) }))
    //     const context = {
    //         method: 'set_visualization_list',
    //         slug: dashboard.slug,
    //         visualization_list: vizualArray,
    //     }
    //     sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
    // }
    // const sendUpdateQueries = () => {
    //     queries.filter(q => q.updated).map(q => { return { id: q.id, name: q.name, query: q.query } }).map(q => {
    //         const context = {
    //             method: 'update_query',
    //             id: q.id,
    //             name: q.name,
    //             query: q.query,
    //         }
    //         sendPostData(props.path, context, props.updateQuerie, props.setIsLoading)
    //     })
    //     updateQueries(queries.map(q => { return { ...q, updated: false } }))
    // }
    // const sendUpdateVisualization = () => {
    //     queries.map(q => q.visualizations.map(v => {
    //         if (v.updated) {
    //             const context = {
    //                 method: 'update_visualization',
    //                 name: v.name,
    //                 id: v.id,
    //             }
    //             const updateV = data => { props.updateVisualizations([data]) }
    //             sendPostData(props.path, context, updateV, props.setIsLoading)
    //         }
    //     }))
    //     updateQueries(queries.map(q => { return { ...q, visualizations: q.visualizations.map(v => { return { ...v, updated: false } }) } }))
    // }
    // const updateDashboard = () => {
    //     const context = {
    //         method: 'update_dashboard',
    //         id: dashboard.id,
    //         name: name,
    //         tags: tags,
    //     }
    //     sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
    // }
    // const sendDataToChange = () => {
    //     sendSetVisualizations()
    //     sendUpdateQueries()
    //     updateDashboard()
    //     sendUpdateVisualization()
    // }
    // const sendPublish = () => {
    //     const context = {
    //         method: "publish_dashboard",
    //         id: dashboard.id,
    //     }
    //     sendPostData(props.path, context, data => { updateURL(data.public_url); props.setIsLoading(false) }, props.setIsLoading)
    // }
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
            {/* <CreateQuerrie /> */}
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

export default connect(mapStateToProps, { setIsLoading, updateDashboards, updateVisualizations, updateQuerie, updateVisualArray, updateQueries })(DashboardEditor)