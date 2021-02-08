import { colors } from '@material-ui/core'
import React, { Component } from 'react'

class Dashboard extends Component {
    render() {
        return (
            <div className="border border-solid container mt-2">
                <h3 className="text-center mt-2">"{this.props.d.name}"</h3>
                {this.props.d.public_url ?
                    <div className="row ml-2">
                        <p className="mr-2">Ссылка на</p><a href={this.props.d.public_url}>dashboard</a>
                    </div>
                    : ""}
                <p className="ml-2 mr-2">Тэги:</p>
                <ul>{this.props.d.tags.map((t, i) => <li key={i}>{t}</li>)}</ul>
                <button className="btn btn-sm btn-primary mb-2"><a style={{ color: "white" }} href={`/dashboard/${this.props.d.slug}`}>Редактировать</a></button>
            </div>
        )
    }
}

export default Dashboard