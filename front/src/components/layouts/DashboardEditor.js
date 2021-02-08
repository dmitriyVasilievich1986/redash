import React, { Component } from 'react'
import axios from 'axios'

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

class DashboardEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            id: null,
            name: '',
            tags: [],
        }
    }
    componentDidMount() {
        axios.get(`/get_single_dashboard/${this.props.match.params.slug}`)
            .then(data => this.setState({ name: data.data.dashboard.name, id: data.data.dashboard.id, isloading: false, tags: data.data.dashboard.tags }))
            .catch(err => { console.log(err); this.setState({ isloading: false }) })
    }
    onChangeAddTagsHandler(e) {
        let newTags = [...this.state.tags]
        newTags[e.target.id] = e.target.value
        this.setState({ tags: newTags })
    }
    onChangeDeleteTagsHandler(e) {
        this.setState({ tags: this.state.tags.filter((t, i) => t != e.target.value) })
    }
    sendDataToChange() {
        this.setState({ isloading: true })
        const newData = new FormData()
        newData.append('name', this.state.name)
        newData.append('id', this.state.id)
        newData.append('tags', this.state.tags)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post(`/get_single_dashboard/${this.props.match.params.slug}`, newData)
            .then(data => this.setState({ name: data.data.payload.name, tags: [...data.data.payload.tags], isloading: false }))
            .catch(err => { console.log(err); this.setState({ isloading: false }) })
    }
    render() {
        if (this.state.isloading)
            return (<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>)
        return (
            <div>
                <div className="mt-3 mb-3"><a href="/">Назад</a></div>
                <label className="mt-2">Название:</label>
                <input type="text" className="form-control" placeholder="Название" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                <label className="mt-2">Тэги:</label>
                <ul>
                    {this.state.tags.map((t, i) => <div key={i} className="row align-items-center"><li><input id={i} type="text" className="form-control" placeholder="Тэг" value={this.state.tags[i]} onChange={this.onChangeAddTagsHandler.bind(this)} /></li><HighlightOffIcon style={{ cursor: "pointer" }} onClick={e => this.setState({ tags: this.state.tags.filter((s, i2) => i2 != i) })} /></div>)}
                </ul>
                <AddCircleOutlineIcon style={{ cursor: "pointer" }} onClick={() => this.setState({ tags: [...this.state.tags, "новый"] })} />
                <div>
                    <button onClick={this.sendDataToChange.bind(this)} className="btn btn-sm btn-primary mt-4">Сохранить изменения</button>
                </div>
            </div>
        )
    }
}

export default DashboardEditor