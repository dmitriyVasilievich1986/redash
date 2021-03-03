import TYPE_ACTIONS from '../actions/types'

const initialState = {
    path: window.location.pathname,
    isLoading: true,
    filterTag: "",
    username: "",
}

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPE_ACTIONS.UPDATE_STATE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}