import getContext from '../common/getContext.ts'
import TYPE_ACTIONS from '../../actions/types'
import store from '../../store'
import axios from 'axios'

function setIsLoading(isLoading) {
    store.dispatch({
        type: TYPE_ACTIONS.UPDATE_STATE,
        payload: { isLoading: isLoading },
    })
}

export default function (arrayObject, functionUpdate, isUpdated = true) {
    const needToUpdate = Array.isArray(isUpdated) ? isUpdated.map(u => u.updated).indexOf(true) >= 0 : isUpdated
    if (!needToUpdate)
        return
    const path = store.getState().main.path
    setIsLoading(true)
    const [contextData, headers] = getContext(arrayObject)
    axios.post(path, contextData, headers)
        .then(data => {
            if (data.data.message) {
                console.log(data.data.message)
            } else if (data.data.payload) {
                functionUpdate(data.data.payload)
            }
            setIsLoading(false)
        })
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
}