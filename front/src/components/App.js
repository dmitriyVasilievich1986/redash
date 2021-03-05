//#region Импорт модулей
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './store'
import axios from 'axios'

import { DashboardList, DashboardEditor } from './layouts'
import getContext from './layouts/common/getContext.ts'
import TYPE_ACTIONS from './actions/types'
//#endregion

const currentPath = window.location.pathname

//#region Отправление запроса на сервер. Получение и хранение ответа в redux store
/**
 * Функция принимает список параметров, шлет запрос на сервер,
 * после успешного ответа выполняет функцию, принимаемую в параметрах.
 * 
 * @param {Array<any>} context Список параметров, отсылаемых на api.
 * @param {Function} payloadFunction Функция, выполняемая после успешного ответа сервера. 
 */
function sendPostData(context, payloadFunction) {
    const [contextData, headers] = getContext(context)

    axios.post(currentPath, contextData, headers)
        .then(data => {
            if (data.data.message)
                console.log(data.data.message)
            else if (data.data.payload)
                payloadFunction(data.data.payload)
        })
        .catch(err => console.log(err))
}

/**
 * Простая функция, принимает тип и значение, для измнения состояния
 * данных в redux store.
 * 
 * @param {String} type Строковое представление типа запроса.
 * @param {Any} payload Объект, для синхронизации данных в redux store.
 */
function storeDispatch(type, payload) {
    store.dispatch({
        type: type,
        payload: payload,
    })
}
//#endregion

function App() {
    useEffect(() => {
        //#region Получаем все первичные данные от сервера. Обновляем состояние в redux store.
        // Получаем от сервера имя пользователя.
        sendPostData(
            { method: 'get_user' },
            username => storeDispatch(TYPE_ACTIONS.UPDATE_STATE, { username: username })
        )
        // Получаем от сервера все дашборды.
        sendPostData(
            { method: 'get_dashboards' },
            dashboards => dashboards.results?.map(d => {
                sendPostData(
                    { method: 'get_dashboard', id: d.slug },
                    db => storeDispatch(TYPE_ACTIONS.UPDATE_DASHBOARDS, db)
                )
            })
        )
        //  Получаем все querie запросы.
        sendPostData(
            { method: 'get_all_queries' },
            queries => queries.results?.map(q => {
                sendPostData(
                    { method: 'get_querie', id: q.id },
                    sq => storeDispatch(TYPE_ACTIONS.UPDATE_QUERIES, sq)
                )
            })
        )
        storeDispatch(TYPE_ACTIONS.UPDATE_STATE, { isLoading: false })
        //#endregion
    })
    return (
        <Provider store={store}>
            <div className='container'>
                <BrowserRouter>
                    <Switch>
                        <Route exact path={currentPath} component={DashboardList} />
                        <Route
                            exact path={`${currentPath}edit/:dashboardSlug`}
                            render={props => <DashboardEditor {...props} currentPath={currentPath} />}
                        />
                    </Switch>
                </BrowserRouter>
                <div style={{ marginTop: "5rem" }} />
            </div>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))