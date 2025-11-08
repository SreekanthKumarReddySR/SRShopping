export const initialState = {
    user: null,
    token: null,
    loading: true
};


export function authReducer(state, action) {
    switch (action.type) {
        case 'INITIALIZE':
            return { ...state, user: action.payload.user || null, token: action.payload.token || null, loading: false };
        case 'LOGIN':
            return { ...state, user: action.payload.user, token: action.payload.token };
        case 'LOGOUT':
            return { user: null, token: null, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}