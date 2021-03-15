import { sendUpdateDashboard } from '../../actions/sendPostActions'
import Visualization from './Visualization'
import { connect } from 'react-redux'
import React from 'react'

function Dashboard(props) {
    props.visualizations.map(v => v.setInDashboard(props.d.newVisualizations))
    return (
        <div>
            <h3>"{props.d.name}"</h3>
            {props.d.public_url ?
                <p>Ссылка на <a target={"_blank"} rel={"noopener noreferrer"} href={props.d.public_url}>Dashboard</a></p> :
                ""
            }
            <p>Список визуализаций:</p>
            {props.visualizations
                .filter(v => props.d.queries.indexOf(v.querie) >= 0)
                .map(a => <Visualization key={a.id} v={a} d={props.d} />)
            }
            {props.d.needUpdateVisualizations() ?
                <button onClick={() => sendUpdateDashboard(props.d)}>Обновить</button> :
                ""
            }
        </div>
    )
}

// Выгрузка состояний из redux store в параметры функции.
const mapStateToProps = state => ({
    visualizations: state.main.visualizations,
})

export default connect(mapStateToProps)(Dashboard)
