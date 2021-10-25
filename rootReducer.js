import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
//import reducer
const presistConfig = {
 key: 'root',
 storage,
 whitelist: [],
};
const rootReducer = combineReducers({
// add reducer 
  // reducer name:imported reducer
});
export default persistReducer(presistConfig, rootReducer);
