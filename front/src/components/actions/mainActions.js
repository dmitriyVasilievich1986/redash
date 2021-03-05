import TYPE_ACTIONS from './types'

//#region Простые функции для изменения состояния redux store.

export const updateDashboards = newDashboard => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_DASHBOARDS,
        payload: newDashboard,
    })
}

export const updateProperties = newState => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_STATE,
        payload: newState,
    })
}

export const updateQueries = newQueries => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: newQueries,
    })
}

//#endregion