import axios from 'axios'
import getContext from '../common/getContext.ts'

export default function (path, arrayObject, functionUpdate, functionSetIsLoading, isConditionsMeet = false, ...props) {
    if (isConditionsMeet)
        return
    functionSetIsLoading(true)
    const [contextData, headers] = getContext(arrayObject)
    axios.post(path, contextData, headers)
        .then(data => {
            if (data.data.message) {
                console.log(data.data.message)
                functionSetIsLoading(false)
            } else if (data.data.payload) {
                functionUpdate(data.data.payload)
            }
        })
        .catch(err => {
            console.log(err)
            functionSetIsLoading(false)
        })
}