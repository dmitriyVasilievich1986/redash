import { IDashboard, IQuerie, IVisualization } from '../supportClasses/supportClasses'
import TYPE_ACTIONS from './types'
import store from '../store'

//#region Простые функции для изменения состояния redux store.

export const updateProperties = (newState) => {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_STATE,
        payload: newState,
    })
}

export const updateDashboardsResponse = (newDashboard) => {
    const payload = Array.isArray(newDashboard) ?
        newDashboard.map(nd => new IDashboard(nd)) :
        new IDashboard(newDashboard)
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_DASHBOARDS,
        payload: payload,
    })
}

export const updateQueriesResponse = (newQueries, updateVisualizations = false) => {
    if (updateVisualizations) {
        Array.isArray(newQueries) ?
            newQueries.map(q => updateVisualizationsResponse(q.visualizations, q.id)) :
            updateVisualizationsResponse(newQueries.visualizations, newQueries.id)
    }
    const payload = Array.isArray(newQueries) ?
        newQueries.map(nq => new IQuerie(nq)) :
        new IQuerie(newQueries)
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: payload,
    })
}

export const updateVisualizationsResponse = (newVisualizations, querieID = null, visualizationsID = []) => {
    const payload = Array.isArray(newVisualizations) ?
        newVisualizations.map(nv => new IVisualization(nv, querieID, visualizationsID)) :
        new IVisualization(newVisualizations, querieID, visualizationsID)
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_VISUALIZATIONS,
        payload: payload,
    })
}

//#endregion
