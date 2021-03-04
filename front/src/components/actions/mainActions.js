import TYPE_ACTIONS from './types'

//#region last versions

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

export const setIsLoading = newStatus => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.SET_IS_LOADING,
        payload: newStatus,
    })
}

export const getAllDashboards = newDashboardArray => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.GET_ALL_DASHBOARDS,
        payload: newDashboardArray,
    })
}

export const addNewQuerrie = newQ => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.ADD_NEW_QUERRIE,
        payload: newQ,
    })
}

export const addNewDashboard = newD => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.ADD_NEW_DASHBOARD,
        payload: newD,
    })
}

export const updateVisualArray = (newVisualArray = []) => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_VISUAL_ARRAY,
        payload: newVisualArray,
    })
}





export const updateQuerie = newQ => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_QUERIE,
        payload: newQ,
    })
}

export const updateVisualizations = newVisualizations => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_VISUALIZATIONS,
        payload: newVisualizations,
    })
}

export const updateVisualization = newVisualizations => dispatch => {
    dispatch({
        type: TYPE_ACTIONS.UPDATE_VISUALIZATIONS,
        payload: newVisualizations,
    })
}

export const filterArray = e => (dispatch, getState) => {
    const value = e.target.value
    const newArray = getState().main.unfilteredArray.filter(
        d => d.tags.map(t => t.toLowerCase().indexOf(value.toLowerCase()) >= 0).indexOf(true) >= 0 ||
            value == "" ||
            d.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
    )
    dispatch({
        type: TYPE_ACTIONS.FILTER_DASHBOARDS,
        payload: {
            newArray: newArray,
            tag: value,
        },
    })
}