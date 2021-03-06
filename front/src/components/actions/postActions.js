import TYPE_ACTIONS from './types'
import store from '../store'

//#region Простые функции для изменения состояния redux store.

export const updateDashboardsResponse = (newDashboard) => {
    const payload = {
        ...newDashboard,
        updated: false,
        newName: newDashboard.name,
        newTags: newDashboard.tags,
    }
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_DASHBOARDS,
        payload: payload,
    })
}

export const updateQueriesResponse = (newQueries, visualizationsID = []) => {
    const payload = {
        ...newQueries,
        updated: false,
        updatedQuery: null,
        newName: newQueries.name,
        visualizations: newQueries.visualizations.map(v => {
            return {
                ...v,
                updated: false,
                newName: v.name,
                inDashboard: visualizationsID.indexOf(v.id) >= 0,
            }
        })
    }
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: payload,
    })
}

//#endregion