import React, { Component } from 'react'
import axios from 'axios'

class Visualization extends Component {
    constructor(props) {
        super(props)
        const filtDas = dashboard.widgets.filter(w => w.visualization.id == this.props.v.id)
        this.state = {
            visualizationID: this.props.v.id,
            visualizationName: this.props.v.name,
            visual: this.props.vis,
            widget: filtDas.length > 0 ? filtDas[0].id : null,
        }
        // console.log(dashboard.widgets.filter(w => w.visualization.id == this.state.visualizationID))
        // console.log(this.state.widget)
        // console.log(this.props.vis.indexOf(this.state.visualizationID) >= 0)
    }
    sendChangesHandler() {
        const someData = new FormData()
        someData.append('method', 'change_visualization')
        someData.append('name', this.state.visualizationName)
        someData.append('type', this.state.selectValue)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => this.setState({ visualizationName: data.data.name, selectValue: data.data.options.globalSeriesType }))
            .catch(err => console.log(err))
    }
    addWidget() {
        const someData = new FormData()
        someData.append('method', 'add_widget')
        someData.append('id', this.state.visualizationID)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            // .then(data => console.log(data.data))
            .then(data => this.setState({ visual: !this.state.visual, widget: data.data.id }))
            .catch(err => console.log(err))
    }
    deleteWidget() {
        const someData = new FormData()
        someData.append('method', 'delete_widget')
        someData.append('id', this.state.widget)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            // .then(data => console.log(data.data))
            .then(data => this.setState({ visual: !this.state.visual, widget: data.data.id }))
            .catch(err => console.log(err))
    }
    render() {
        return (
            <div className="m-4">
                <input className='w-100' value={this.state.visualizationName} onChange={e => this.setState({ visualizationName: e.target.value })} placeholder="visualization name" />
                {/* <select value={this.state.selectValue} onChange={e => this.setState({ selectValue: e.target.value })} className='w-100'>
                    <option>pie</option>
                    <option>line</option>
                    <option>column</option>
                </select> */}
                {this.state.visual ?
                    <button onClick={this.deleteWidget.bind(this)} className="btn btn-sm btn-primary">Удалить</button> :
                    <button onClick={this.addWidget.bind(this)} className="btn btn-sm btn-primary">Добавить</button>
                }
            </div>
        )
    }
}

export default Visualization