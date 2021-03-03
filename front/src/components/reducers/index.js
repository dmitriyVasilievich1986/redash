import mainReducer from './mainReducer'
import propertiesReducer from './propertiesReducer'
import { combineReducers } from 'redux'

export default combineReducers({
    main: mainReducer,
})