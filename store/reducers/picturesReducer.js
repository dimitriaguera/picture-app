const SET_PICTURE = 'SET_PICTURE';

export const storePicture = function(picture) {
    return {
        type: SET_PICTURE,
        picture: picture
    };
};

function getStorablePicture(picture) {
    return {
        uri: picture.uri,
        width: picture.width,
        height: picture.height
    };
}

const initialState = {
    data: []
};

function picturesReducer(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case SET_PICTURE:
            nextState = {
                data: [...state.data, getStorablePicture(action.picture)]
            };
            break;
        default:
            return state;
    }
    return nextState;
}

export default picturesReducer;
