import TYPE_ACTIONS from '../actions/types'
import getChangedArray from '../layouts/common/getChangedArray.ts'

const initState = {
    path: window.location.pathname,
    filteredDashboardsArray: [],
    dashboardsArray: [],
    unfilteredArray: [],
    visualizations: [],
    filteredArray: [],
    visualArray: [],
    isLoading: false,
    username: "",
    queries: [],
    tag: "",
}

export default function (state = initState, action) {
    const filterDashboards = (dashboards, tag = state.tag) => {
        const filteredDashboards = dashboards
            .filter(db => state.username == adminName || db.tags.indexOf(state.username) >= 0)
            .filter(db => tag == '' ||
                db.name.toLowerCase().indexOf(tag.toLowerCase()) >= 0 ||
                db.tags.map(t => t.toLowerCase().indexOf(tag.toLowerCase()) >= 0).indexOf(true) >= 0
            )
        return filteredDashboards
    }
    switch (action.type) {
        case TYPE_ACTIONS.UPDATE_STATE:
            const filteredDashboardsArray = action.payload.tag || action.payload.username ?
                filterDashboards(state.dashboardsArray, action.payload.tag) :
                state.filteredDashboardsArray
            return {
                ...state,
                ...action.payload,
                filteredDashboardsArray: filteredDashboardsArray,
            }
        case TYPE_ACTIONS.UPDATE_DASHBOARDS:
            const dashboards = getChangedArray(state.dashboardsArray, action.payload, false, true)
            return {
                ...state,
                isLoading: false,
                dashboardsArray: dashboards,
                filteredDashboardsArray: filterDashboards(dashboards),
            }
        case TYPE_ACTIONS.UPDATE_QUERIES:
            const newQueries = getChangedArray(state.queries, action.payload, false, true)
                .map(q => {
                    return {
                        updated: false,
                        newName: q.name,
                        updatedQuery: null,
                        ...q,
                        visualizations: q.visualizations.map(v => {
                            return {
                                updated: false,
                                newName: v.name,
                                inDashboard: false,
                                ...v,
                            }
                        })
                    }
                })
            return {
                ...state,
                isLoading: false,
                queries: newQueries,
            }
        default:
            return state
    }
}