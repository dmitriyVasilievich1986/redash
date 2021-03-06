//#region Импорт модулей
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDashboards } from '../../actions/mainActions'
import sendPostData from '../common/sendPostData'
import Visualizations from './Visualizations'
import Tags from '../common/Tags'
//#endregion

//#region Формирование списков querie запросов и визуализаций, которые связаны с данным дашбордом
/**
 * Функция принимает список тэгов и список запросов.
 * Сначала парсит тэги на соответствие выражению: 'querie_id'.
 * Возвращает список, совпадающих querie запросов с id в тэгах дашборда.
 * 
 * @param {Array<string>} tags Тэги этого дашборда
 * @param {Array<Object>} queries Список querie запросов
 * @returns {Array} Список, содержащий querie запросы, id которых содержится в тэгах борда.
 */
function getQueriesIDFromTags(tags, queries) {
    const queriesID = tags.filter(t => t.match(/querie_/) != null).map(t => parseInt(t.match(/querie_.*/g)[0].replace('querie_', '')))
    return queries.filter(q => queriesID.indexOf(q.id) >= 0)
}

/**
 * Функция принимает объект дашборд, список querie запросов, связанных с этим бордом.
 * Фильтрует список запросов и возвращает список визуализаций,
 * которые связаны с этим дашбордом.
 * 
 * @param {Array} queriesFromDashboard Список querie запросов, сцепленных с этим бордом.
 * @param {Object} dashboard Этот дашборд.
 * @returns {Array} Список визуализаций, связанных с данным дашбордом.
 */
function getVisualizations(queriesFromDashboard, dashboard) {
    // из всех querie запросов вытягиваем визуализации, которые принадлежат этому дашборду
    const dashboardVisualizations = dashboard.widgets.map(w => w.visualization.id)
    const visualizations = []
    queriesFromDashboard.map(q => q.visualizations.map(
        v => {
            visualizations.push({
                ...v,
                updated: false,
                inDashboard: dashboardVisualizations.indexOf(v.id) >= 0,
            })
        }
    ))
    return visualizations
}
//#endregion

function Dashboard(props) {
    // состояние дашборда, нужно ли делать запрос на сервер, если изменилось состояние
    const [updated, setUpdated] = useState(false)
    // получаем визуализации, принадлежащие только этому дашборду
    const queriesFromDashboard = getQueriesIDFromTags(props.d.tags, props.queries)
    const [visualizations, updateVisualization] = useState(getVisualizations(queriesFromDashboard, props.d))
    // создаем хук для тегов этого борда.
    const [tags, updateTags] = useState([...props.d.tags])
    // Вытягиваем ссылку на дашборд, если он опубликован. Заменяем IP адрес на доменное имя.
    const url = props.d.public_url ? props.d.public_url.replace('172.16.0.243', 'stats.beelinewifi.ru') : null

    //#region Отправить данные на api для изменения этого дашборда

    const sendDataToChange = e => {
        e.preventDefault()
        // добавить, убрать визуализации для этого дашборда
        sendUpdateVisualisation()
    }
    // Создает запрос на измнение списка отображаемых визуализаций для этого дашборда.
    const sendUpdateVisualisation = () => {
        const visualArray = visualizations.filter(v => v.inDashboard).map(v => v.id)
        const context = {
            method: 'set_visualization_list',
            visualization_list: visualArray,
            slug: props.d.slug,
        }
        sendPostData(context, props.updateDashboards, visualizations)
        visualizations.map(v => { return { ...v, updated: false } })
    }

    //#endregion

    return (
        <div className='dashboard'>
            {/* название дашборда */}
            <h3>"{props.d.name}"</h3>
            {/* ссылка на дашборд, если он опубликован */}
            {url ?
                <div className="row">
                    <p style={{ marginRight: '3px' }}>Ссылка на</p><a href={url}>dashboard</a>
                </div>
                : ''}
            {/* Тэги дашборда */}
            <Tags tags={[tags, null]} />
            {/* Выводим список визуализаций, связанных с этим бордом. */}
            {visualizations.map(v =>
                <Visualizations
                    visualizations={[visualizations, updateVisualization]}
                    key={v.id}
                    v={v}
                />
            )}
            {/* Кнопки сохранения данных, перехода на страницу редактора дашборда */}
            {props.username == 'admin' ?
                <div>
                    <Link className='edit-button' role='button' to='#' onClick={sendDataToChange}>Сохранить изменения</Link>
                    <Link className='edit-button' role='button' to={`${props.path}edit/${props.d.slug}/`}>Редактировать</Link>
                </div>
                : ''}
        </div>
    )
}

// Выгрузка состояний из redux store в параметры функции.
const mapStateToProps = state => ({
    username: state.main.username,
    queries: state.main.queries,
    path: state.main.path,
})

export default connect(mapStateToProps, { updateDashboards })(Dashboard)