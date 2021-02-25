import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDashboards, setIsLoading } from '../../actions/mainActions'
import sendPostData from '../common/sendPostData'
import Tags from './Tags'


function Dashboard(props) {
    const [tags, setTags] = useState([...props.d.tags])
    const url = props.d.public_url ? props.d.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null
    const sendDataToChange = e => {
        e.preventDefault()
        const context = {
            method: 'update_dashboard',
            name: props.d.name,
            id: props.d.id,
            tags: tags,
        }
        sendPostData(props.path, context, props.updateDashboards, props.setIsLoading)
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
    path: state.main.path,
})

export default connect(mapStateToProps, { updateDashboards, setIsLoading })(Dashboard)