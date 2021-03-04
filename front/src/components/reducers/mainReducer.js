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
            .filter(db => state.username == 'admin' || db.tags.indexOf(state.username) >= 0)
            .filter(db => db.name.toLowerCase().indexOf(tag.toLowerCase()) >= 0 ||
                db.tags.map(t => t.toLowerCase().indexOf(tag.toLowerCase()) >= 0).indexOf(true) >= 0
            )
        return filteredDashboards
    }
    switch (action.type) {
        case TYPE_ACTIONS.UPDATE_STATE:
            const filteredDashboardsArray = action.payload.tag ? filterDashboards(state.dashboardsArray, action.payload.tag) : state.filteredDashboardsArray
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
            return {
                ...state,
                isLoading: false,
                queries: getChangedArray(state.queries, action.payload, false, true),
            }
        case TYPE_ACTIONS.SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }
        case TYPE_ACTIONS.SET_PATH:
            return {
                ...state,
                path: action.payload,
            }
        case TYPE_ACTIONS.GET_ALL_VISUALIZATIONS:
            return {
                ...state,
                visualizations: action.payload,
            }
        case TYPE_ACTIONS.UPDATE_VISUAL_ARRAY:
            return {
                ...state,
                visualArray: action.payload,
            }
        case TYPE_ACTIONS.SET_PROPERTIES:
            return {
                ...state,
                path: action.payload.path,
                username: action.payload.username,
            }
        case TYPE_ACTIONS.GET_ALL_QUERIES:
            return {
                ...state,
                queries: [
                    ...action.payload.map(q => {
                        return {
                            ...q,
                            visualizations: q.visualizations.map(v => {
                                return {
                                    ...v,
                                    inDashboard: false,
                                }
                            })
                        }
                    })
                ],
            }
        case TYPE_ACTIONS.UPDATE_QUERIE:
            const newQ = getChangedArray(state.queries, [action.payload])
            return {
                ...state,
                queries: newQ,
                isLoading: false,
            }
        case TYPE_ACTIONS.ADD_NEW_QUERRIE:
            return {
                ...state,
                queries: [...state.queries, action.payload],
                isLoading: false,
            }
        case TYPE_ACTIONS.UPDATE_QUERIES:
            const queries = [...state.queries.map(q => {
                const newVis = getChangedArray(q.visualizations.map(v => { return { ...v, inDashboard: false } }), action.payload)
                return {
                    ...q,
                    visualizations: newVis,
                }
            })]
            return {
                ...state,
                queries: queries,
                isLoading: false,
            }
        case TYPE_ACTIONS.UPDATE_VISUALIZATIONS:
            const visualizations = [...state.queries.map(q => {
                const newVis = getChangedArray(q.visualizations, action.payload)
                return {
                    ...q,
                    visualizations: newVis,
                }
            })]
            return {
                ...state,
                queries: visualizations,
                isLoading: false,
            }
        case TYPE_ACTIONS.FILTER_DASHBOARDS:
            return {
                ...state,
                tag: action.payload.tag,
                filteredArray: action.payload.newArray,
            }
        case TYPE_ACTIONS.ADD_NEW_DASHBOARD:
            return {
                ...state,
                isLoading: false,
                filteredArray: [...state.filteredArray, action.payload.dashboard],
                unfilteredArray: [...state.unfilteredArray, action.payload.dashboard],
                queries: [...state.queries, action.payload.map, action.payload.chart],
            }
        // case TYPE_ACTIONS.UPDATE_DASHBOARDS:
        //     const newDashboardList = getChangedArray(state.unfilteredArray, [action.payload])
        //     const newFilteredArray = newDashboardList.filter(
        //         d => d.tags.map(t => t.toLowerCase().indexOf(state.tag.toLowerCase()) >= 0).indexOf(true) >= 0 ||
        //             state.tag == "" ||
        //             d.name.toLowerCase().indexOf(state.tag.toLowerCase()) >= 0
        //     )
        //     return {
        //         ...state,
        //         unfilteredArray: newDashboardList,
        //         filteredArray: newFilteredArray,
        //         isLoading: false,
        //     }
        case TYPE_ACTIONS.GET_ALL_DASHBOARDS:
            const unfilteredArray = action.payload.filter(a => state.username == 'admin' || a.tags.indexOf(state.username) >= 0)
            return {
                ...state,
                unfilteredArray: unfilteredArray,
                filteredArray: unfilteredArray,
                isLoading: false,
            }
        default:
            return state
    }
}