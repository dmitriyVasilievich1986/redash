import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDashboards, setIsLoading } from '../../actions/mainActions'
import Visualizations from './Visualizations'
import sendPostData from '../common/sendPostData'
import Tags from './Tags'


function Dashboard(props) {
    const querriesID = props.d.tags.filter(t => t.match(/querie_/) != null).map(t => parseInt(t.match(/querie_.*/g)[0].replace('querie_', '')))
    const findQuerrie = props.queries.filter(q => querriesID.indexOf(q.id) >= 0)
    const widgets = props.d.widgets.map(w => w.visualization.id)
    const vi = []
    findQuerrie.map(q => q.visualizations.map(v => {
        vi.push({ ...v, inDashboard: widgets.indexOf(v.id) >= 0, updated: false })
    }))
    const [visualizations, updateVisualization] = useState(vi)
    const [tags, setTags] = useState([...props.d.tags])
    const url = props.d.public_url ? props.d.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null
    const sendDataToChange = e => {
        e.preventDefault()
        sendUpdateVisualisation()
        const context = {
            method: 'update_dashboard',
            name: props.d.name,
            id: props.d.id,
            tags: tags,
        }
        sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
    }
    const sendUpdateVisualisation = () => {
        const needToUpdate = visualizations.map(v => v.updated).indexOf(true) >= 0
        if (!needToUpdate)
            return
        const visualArray = visualizations.filter(v => v.updated).map(v.id)
        const context = {
            method: 'set_visualization_list',
            visualization_list: visualArray,
            slug: props.d.slug,
        }
        sendPostData(props.path, context, data => { console.log(data.data); }, props.setIsLoading)
    }
    return (
        <div className='dashboard'>
            <h3>"{props.d.name}"</h3>
            {url ?
                <div style={{ display: "flex", alignItems: 'center' }}>
                    <p style={{ marginRight: '3px' }}>Ссылка на</p><a href={url}>dashboard</a>
                </div>
                : ''}
            <Tags
                updateTags={newTags => setTags(newTags)}
                username={props.username}
                tags={tags} />
            {visualizations.map(v => <Visualizations vis={[visualizations, updateVisualization]} key={v.id} v={v} />)}
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
    unfilteredArray: state.main.unfilteredArray,
    username: state.main.username,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps, { updateDashboards, setIsLoading })(Dashboard)