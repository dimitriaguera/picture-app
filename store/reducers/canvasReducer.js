const PLAY_CANVAS = 'PLAY_CANVAS';
const STOP_CANVAS = 'STOP_CANVAS';

export const playCanvas = function() {
    return {
        type: PLAY_CANVAS,
    }
}

export const stopCanvas = function() {
    return {
        type: STOP_CANVAS,
    }
}

const initialState = {
    play: false,
}

function canvasReducer(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case PLAY_CANVAS :
            nextState = {...state, play: true}
            break;

        case STOP_CANVAS :
            nextState = {...state, play: false}
            break;

        default:
            return state;
    }
    return nextState;
}

export default canvasReducer;