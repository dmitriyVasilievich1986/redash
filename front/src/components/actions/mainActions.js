import TYPE_ACTIONS from './types'
import getChangedArray from '../layouts/common/getChangedArray'
import store from '../store'


function addUpdated(newObject) {
    const payload = []
    if (Array.isArray(newObject)) {
        newObject.map(o => payload.push({ updated: true, ...o }))
    } else {
        payload.push({ updated: true, ...newObject })
    }
    return payload
}

//#region Простые функции для изменения состояния redux store.

export const updateDashboards = newDashboard => {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_DASHBOARDS,
        payload: newDashboard,
    })
}

export const updateProperties = newState => {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_STATE,
        payload: newState,
    })
}

export const updateQueries = newQueries => {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: newQueries,
    })
}

export const updateVisualizations = (querie, newVisualizations) => {
    const visualizations = getChangedArray(querie.visualizations, newVisualizations)
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: { ...querie, visualizations: visualizations },
    })
}

//#endregion

export const initializeArrays = dashboardID => {
    const dashboards = store.getState().main.dashboardsArray
    const queries = store.getState().main.queries
    const dashboard = dashboards.filter(d => d.id == dashboardID)[0]
    const dashboardVisualizations = dashboard.widgets.map(w => w.visualization.id)
    const newDashboards = dashboards.map(d => {
        return {
            ...d,
            updated: false,
            newTags: d.tags,
            newName: d.name,
        }
    })
    const newQueries = queries.map(q => {
        return {
            ...q,
            newName: q.name,
            updatedQuery: null,
            visualizations: q.visualizations.map(v => {
                return {
                    ...v,
                    updated: false,
                    newName: v.name,
                    inDashboard: dashboardVisualizations.indexOf(v.id) >= 0,
                }
            })
        }
    })
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_DASHBOARDS,
        payload: newDashboards,
    })
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIES,
        payload: newQueries,
    })
}