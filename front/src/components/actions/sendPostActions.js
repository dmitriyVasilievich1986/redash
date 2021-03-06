import { updateDashboardsResponse, updateQueriesResponse } from './postActions'
import sendPostData from '../layouts/common/sendPostData'
import store from '../store'
import TYPE_ACTIONS from './types'


//#region Функции для отправления запроса на сервер.
// Функции отправлюят и обновляют данные о 
// дашбордах, querie запросах, визулизациях
export const sendUpdateDashboard = async () => {
    const dashboards = store.getState().main.dashboardsArray
    await dashboards
        .filter(d => d.updated === true)
        .map(d => {
            const context = {
                method: 'update_dashboard',
                name: d.newName,
                tags: d.newTags,
                id: d.id,
            }
            sendPostData(context, updateDashboardsResponse)
        })
}

export const sendUpdateQueries = async () => {
    const queries = store.getState().main.queries
    await queries
        .filter(q => q.updated)
        .map(q => {
            const context = {
                query: q.updatedQuery === null ? q.query : q.updatedQuery,
                method: 'update_query',
                name: q.newName,
                id: q.id,
            }
            sendPostData(context, updateQueriesResponse)
        })
}

export const sendUpdateVisualization = async (visualizationsID = []) => {
    const queries = store.getState().main.queries
    await queries.map(q => q.visualizations
        .filter(v => v.updated)
        .map(v => {
            const context = {
                method: 'update_visualization',
                name: v.newName,
                querie_id: q.id,
                id: v.id,
            }
            sendPostData(context, querie => updateQueriesResponse(querie, visualizationsID))
        }))
}
//#endregion

export const sendSetVisualizationsList = async (slug) => {
    let updated = false
    const queries = store.getState().main.queries
    const visualizationsList = []
    queries.map(q => {
        q.visualizations.map(v => {
            if (v.inDashboard)
                visualizationsList.push(v.id)
            if (v.updated)
                updated = true
        })
    })
    const context = {
        visualization_list: visualizationsList,
        method: 'set_visualization_list',
        slug: slug,
    }
    await sendPostData(context, updateDashboardsResponse, updated)
}

export const sendRefreshQuerrie = (querieID) => {
    const context = {
        method: "post_refresh_querrie",
        id: querieID,
    }
    sendPostData(context, () => {
        store.dispatch({
            type: TYPE_ACTIONS.UPDATE_STATE,
            payload: { isLoading: false },
        })
    })
}