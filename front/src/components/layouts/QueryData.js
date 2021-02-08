import React, { Component } from 'react'
import axios from 'axios'
import Visualization from './Visualization'

class QueryData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryID: this.props.query.id,
            queryName: this.props.query.name,
            query: this.props.query.query,
            a: dashboard.widgets.map(w => w.visualization.id),
            // visualID: this.props.query.v.id,
            // visualName: this.props.query.v.name,
            // visualType: this.props.query.v.options.globalSeriesType ? this.props.query.v.options.globalSeriesType : null,
        }
        // console.log(this.props.query)
        // const a = dashboard.widgets.map(w => w.visualization.id)
        // console.log(dashboard)
        // console.log(this.state.a)
    }
    sendChangesHandler() {
        const someData = new FormData()
        someData.append('method', 'change_query')
        someData.append('name', this.state.queryName)
        someData.append('query', this.state.query)
        someData.append('id', this.state.queryID)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => this.setState({ queryName: data.data.name, query: data.data.query }))
            .catch(err => console.log(err))
    }
    sendChangeVisualizaionHandler() {
        const someData = new FormData()
        someData.append('method', 'change_visualization')
        someData.append('type', this.state.visualType)
        someData.append('name', this.state.visualName)
        someData.append('id', this.state.visualID)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => this.setState({ visualName: data.data.name, visualType: data.data.options.globalSeriesType }))
            .catch(err => console.log(err))

    }
    refreshButtonHandler() {
        const someData = new FormData()
        someData.append('method', 'refresh')
        someData.append('id', this.state.queryID)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => console.log(data.data))
            .catch(err => console.log(err))
    }
    addWidget() {
        const someData = new FormData()
        someData.append('method', 'add_widget')
        someData.append('id', this.state.visualID)
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post('/', someData, headers)
            .then(data => console.log(data.data))
            .catch(err => console.log(err))
    }
    render() {
        return (
            <div className="m-4">
                <button onClick={this.refreshButtonHandler.bind(this)} className="btn btn-primary btn-sm pl-4 pr-4">Refresh</button>
                <input className='w-100' value={this.state.queryName} onChange={e => this.setState({ queryName: e.target.value })} placeholder="query name" />
                <input className='w-100' value={this.state.query} onChange={e => this.setState({ query: e.target.value })} placeholder="query string" />
                <button onClick={this.sendChangesHandler.bind(this)} className="btn btn-sm btn-primary">Изменить</button>
                {/* <input className='w-100' value={this.state.visualName} onChange={e => this.setState({ visualName: e.target.value })} placeholder="visualization name" /> */}
                {this.props.query.visualizations.map((v, i) => <Visualization vis={this.state.a.indexOf(v.id) >= 0} v={v} key={i} />)}
                {/* {this.state.visualType ?
                    <select value={this.state.visualType} onChange={e => this.setState({ visualType: e.target.value })} className='w-100'>
                        <option>pie</option>
                        <option>line</option>
                        <option>column</option>
                    </select> : ""}
                <button onClick={this.sendChangeVisualizaionHandler.bind(this)} className="btn btn-sm btn-primary">Изменить</button> */}
                {/* <div>
                    <button onClick={this.addWidget.bind(this)} className="btn btn-sm btn-primary">Добавить</button>
                </div> */}
            </div >
        )
    }
}

export default QueryData