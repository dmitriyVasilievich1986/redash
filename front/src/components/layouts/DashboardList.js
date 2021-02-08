import React, { Component } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class DashboardList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterSlug: "",
            isloading: true,
            filteredArray: [],
            unfilteredArray: [],
        }
    }
    componentDidMount() {
        axios.get('/get_dashboards')
            .then(data => this.setState({ unfilteredArray: [...data.data.dashboard], filteredArray: [...data.data.dashboard], isloading: false }))
            .catch(err => { console.log(err); this.setState({ isloading: false }); })
    }
    onChangeHandler(e) {
        this.setState({
            filterSlug: e.target.value,
            filteredArray: this.state.unfilteredArray.filter(d => d.tags.indexOf(e.target.value.toLowerCase()) >= 0 || e.target.value == "" || d.name.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0)
        })
    }
    render() {
        if (this.state.isloading)
            return (<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>)
        return (
            <div>
                <div className="input-group mb-3 mt-2 w-100">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Фильтр по тэгам или имени</span>
                    </div>
                    <input type="text" className="form-control" placeholder="Тэг или название" value={this.state.filterSlug} onChange={this.onChangeHandler.bind(this)} />
                </div>
                {this.state.filteredArray.map((d, i) => <Dashboard key={i} d={d} />)}
            </div>
        )
    }
}


export default DashboardList