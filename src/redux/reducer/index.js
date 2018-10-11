const SETFIELD = 'SET_FIELS'
const SEND_DATA = 'SENT_DATA'
const SENT_DATA_PENDING = 'SENT_DATA_PENDING'
const SENT_DATA_FULFILLED = 'SENT_DATA_FULFILLED'
export const mainReducer = (state = { link: '', loading: false }, action) => {
    console.log(action)
    switch (action.type) {
    case SETFIELD:
        return {
            ...state,
            [action.key]: action.value //set state follow with key
        }
    case SEND_DATA:
        return {
            ...state
        }
    case SENT_DATA_PENDING: {
        return {
            ...state,
            loading: true
        }
    }
    case SENT_DATA_FULFILLED: {
        return {
            ...state,
            loading: false
        }
    }
    default:
        return state
    }
}

export const setField = (key, value) => {
    return {
        type: SETFIELD,
        key,
        value
    }
    // console.log('payload', payload)
}

export const sendData = () => ({
    type: SEND_DATA,
    payload: new Promise(resolve => {
        setTimeout(() => {
            resolve({ link: '', loading: false })
        }, 2000)
    })
})
