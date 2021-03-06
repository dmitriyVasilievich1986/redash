//#region Импорт модулей
import { updateQueries } from '../../actions/mainActions'
import { sendRefreshQuerrie } from '../../actions/sendPostActions'
import React, { useState } from 'react'

import AddVisualization from './AddVisualization'
import sendPostData from '../common/sendPostData'
import Visualization from './Visualization'
import NameInput from '../common/NameInput'
//#endregion

/**
 * Функция принимает строку запроса в БД. Ищет, содержит ли строка выражение CONTRACT_ID.
 * возвращает строку с номером контракта.
 * 
 * @param {string} query Строка запроса в БД
 * @returns {string} Возвращает строку номер контракта
 */
function extractContractID(query) {
    const match = query.match(/CONTRACT_ID='.*?'/g)
    const parsedQuery = match ? match.map(m => m.replaceAll(/CONTRACT_ID='|'/g, ''))[0] : null
    return parsedQuery
}

function Query(props) {
    //#region Инициализация состояний и констант
    // Получем номер контракта
    const [queryString, updateQueryString] = useState(extractContractID(props.q.query))
    // состояние показа карточки - показать/скрыть
    const [show, updateShow] = useState(false)
    // проверяем это шаблон карта/график
    const map = props.q.query.match(/GPS_LONGITUDE/g) !== null
    //#endregion

    //#region Логика отправлений запросов на сервер
    /**
     * Функция для отправления запроса создания новой визуализации.
     * 
     * @param {string} newName Название
     * @param {string} newLine Выбранный шаблон
     */
    const sendNewVisual = (newName, newLine) => {
        const context = {
            method: 'create_visualization',
            template: map ? 'map' : 'line',
            id: props.q.id,
            name: newName,
            line: newLine,
        }
        sendPostData(context, props.updateQueries)
    }
    //#endregion

    //#region Логика обновления данных в списке querie запросов
    // функция получает, обновляет данные списка querie запросов
    const querieUpdateHandler = newQuerie => {
        const updatedQuerie = { ...props.q, ...newQuerie }
        updateQueries(updatedQuerie)
    }
    //#endregion

    return (
        <div className="querie">
            <div className="querie-header" onClick={() => updateShow(!show)}>{props.q.name}</div>
            {/* Переключение видимости - показать/скрыть */}
            <div style={show ? { marginLeft: '1rem' } : { marginLeft: "1rem", display: 'none' }}>
                <button onClick={() => sendRefreshQuerrie(props.q.id)} className="edit-button">Обновить</button>
                <NameInput name={[props.q.newName, n => querieUpdateHandler({ newName: n })]} />
                {/* Выбираем шаблон querie запроса. Заменяем номер контракта в query строке */}
                {queryString ?
                    <div className="row mt1">
                        <label style={{ marginRight: "5px" }}>Выбор шаблона:</label>
                        <select
                            style={{ width: "250px" }}
                            value={queryString}
                            onChange={e => {
                                updateQueryString(e.target.value)
                                const newQuery = props.q.query.replaceAll(/CONTRACT_ID='.*?'/g, `CONTRACT_ID='${e.target.value}'`)
                                querieUpdateHandler({ query: newQuery })
                            }}>
                            {Object.keys(CONTRACTS_ID).map(k => <option key={k} value={k}>{CONTRACTS_ID[k]}</option>)}
                        </select>
                    </div>
                    : ""}
                {/* Показывам список визуализаций */}
                <div style={{ marginTop: "1rem" }}>
                    <label>Визуализации:</label>
                    {props.q.visualizations.map(v =>
                        <Visualization key={v.id} v={v} q={props.q} />
                    )}
                </div>
                {/* Компонент добавления новой визуализации */}
                {queryString ? <AddVisualization map={map} createVisualization={sendNewVisual} /> : ""}
                <div style={{ marginBottom: "1rem" }} />
            </div>
        </div>
    )
}

export default Query