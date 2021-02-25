import { setIsLoading, updateDashboards, updateVisualizations, updateVisualArray, updateQueries, updateQuerie } from '../../actions/mainActions'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Query from './Query'
import Loading from '../dashboardList/Loading'
import getChangedArray from '../common/getChangedArray.ts'

import Tags from '../dashboardList/Tags'
import sendPostData from '../common/sendPostData'

function DashboardEditor(props) {
    const dashboard = props.unfilteredArray.filter(d => d.slug == props.match.params.dashboardSlug)[0]
    const visualArray = dashboard.widgets ? dashboard.widgets.map(w => w.visualization.id) : []
    const [name, updateName] = useState(dashboard.name)
    const [tags, updateTags] = useState(dashboard.tags)
    const [queries, updateQueries] = useState(props.queries.map(q => {
        return {
            ...q, visualizations: q.visualizations.map(v => {
                return { ...v, updated: false, inDashboard: visualArray.indexOf(v.id) >= 0, updatedQuery: null, }
            })
        }
    }))

    const updateVisualizationHandler = newVisualization => {
        const visualizations = [...queries.map(q => {
            const newVis = getChangedArray(q.visualizations, [newVisualization])
            return {
                ...q,
                updated: false,
                visualizations: newVis,
            }
        })]
        updateQueries(visualizations)
    }
    const sendSetVisualizations = () => {
        const vizualArray = []
        queries.filter(q => q.visualizations).map(q => q.visualizations.map(v => { if (v.inDashboard) vizualArray.push(v.id) }))
        const context = {
            method: 'set_visualization_list',
            slug: dashboard.slug,
            visualization_list: vizualArray,
        }
        sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
    }
    const sendUpdateQueries = () => {
        queries.filter(q => q.updated).map(q => { return { id: q.id, name: q.name, query: q.query } }).map(q => {
            const context = {
                method: 'update_query',
                id: q.id,
                name: q.name,
                query: q.query,
            }
            sendPostData(props.path, context, props.updateQuerie, props.setIsLoading)
        })
        updateQueries(queries.map(q => { return { ...q, updated: false } }))
    }
    const sendUpdateVisualization = () => {
        queries.map(q => q.visualizations.map(v => {
            if (v.updated) {
                const context = {
                    method: 'update_visualization',
                    name: v.name,
                    id: v.id,
                }
                const updateV = data => { props.updateVisualizations([data]) }
                sendPostData(props.path, context, updateV, props.setIsLoading)
            }
        }))
        updateQueries(queries.map(q => { return { ...q, visualizations: q.visualizations.map(v => { return { ...v, updated: false } }) } }))
    }
    const updateDashboard = () => {
        const context = {
            method: 'update_dashboard',
            id: dashboard.id,
            name: name,
            tags: tags,
        }
        sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
    }
    const sendDataToChange = () => {
        sendSetVisualizations()
        sendUpdateQueries()
        updateDashboard()
        sendUpdateVisualization()
    }
    if (props.isLoading)
        return (<Loading />)
    return (
        <div style={{ marginTop: "2rem" }}>
            <Link to={`${props.path}?username=${props.username}`}>Назад</Link>
            <div style={{ marginTop: "1rem" }}>
                <label>Название:</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Название"
                    value={name}
                    onChange={e => updateName(e.target.value)} />
            </div>
            <Tags
                username={props.username}
                tags={tags}
                updateTags={newTags => updateTags(newTags)} />
            <div style={{ marginTop: "1rem" }}>
                <label>Queries:</label>
                {queries.map(q =>
                    <Query updateVisual={updateVisualizationHandler} updateQueries={newQuerie => updateQueries(getChangedArray(queries, newQuerie))} key={q.id} q={q} />
                )}
            </div>
            <button style={{ marginTop: "1rem" }} onClick={sendDataToChange}>
                Сохранить изменения
                </button>
        </div>
    )
}

const mapStateToProps = state => ({
    unfilteredArray: state.main.unfilteredArray,
    isLoading: state.main.isLoading,
    username: state.main.username,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps, { setIsLoading, updateDashboards, updateVisualizations, updateQuerie, updateVisualArray, updateQueries })(DashboardEditor)