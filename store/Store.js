import { createStore, combineReducers } from 'redux';
import canvasReducer from './reducers/canvasReducer';
import settingsReducer from './reducers/settingsReducer';
import matrixReducer from './reducers/matrixReducer';
import picturesReducer from './reducers/picturesReducer';

const reducer = combineReducers({
    canvas: canvasReducer,
    settings: settingsReducer,
    pictures: picturesReducer,
    matrix: matrixReducer
});

const Store = createStore(reducer);

export default Store;
