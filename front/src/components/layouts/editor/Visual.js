import React, { Component } from 'react'

const CONTRACTS_ID = {
    'ООО "Ингка Сентерс Рус Оперэйшн"': "SF139",
    'ООО "Леруа Мерлен Восток"': "KI036",
    'АО "Авиакомпания "Сибирь"': "H6086",
    'ООО "Русфинанс Банк", ООО': "VE722",
    'МЕТРО Кэш энд Керри, ООО': "O6138",
    'ООО "БизнесБас", ООО': "LF414",
    'ООО "Алькор и Ко"': "P2172",
    'Кофе Сирена, ООО': "HU606",
    'ОКТОБЛУ, ООО': "FE744",
    'ПАО Росбанк': "IL405",
}

class Visual extends Component {
    constructor(props) {
        super(props)
        const query = this.extractContractID(this.props.v.query)
        this.state = {
            selectedQuery: query ? query : "",
            show: this.props.v.inDashboard,
            name: this.props.v.name,
            query: query,
        }
    }
    extractContractID(query) {
        const match = query.match(/CONTRACT_ID='.*?'/g)
        const parsedQuery = match ? match.map(m => m.replaceAll(/CONTRACT_ID='|'/g, ''))[0] : null
        return parsedQuery
    }
    updateContractID(value) {
        const newQuery = this.props.v.query.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${value}'`)
        return newQuery
    }
    render() {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="checkbox"
                    onChange={() => {
                        const newVisual = { ...this.props.v, inDashboard: !this.props.v.inDashboard }
                        this.props.updateVisualizations(newVisual)
                    }}
                    checked={this.props.v.inDashboard} />
                <p style={{ marginLeft: "5px", marginRight: "2rem" }}>{this.state.name}</p>
                {this.state.query ?
                    <select
                        style={{ width: "250px" }}
                        value={this.state.selectedQuery}
                        onChange={e => {
                            this.setState({ selectedQuery: e.target.value })
                            const newVisual = { ...this.props.v, updatedQuery: this.updateContractID(e.target.value) }
                            this.props.updateVisualizations(newVisual)
                        }}>
                        {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={CONTRACTS_ID[k]}>{k}</option>)}
                    </select>
                    : ''}
            </div>
        )
    }
}

export default Visual