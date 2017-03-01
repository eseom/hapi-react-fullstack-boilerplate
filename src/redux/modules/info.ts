const LOAD = 'info/LOAD'
const LOAD_SUCCESS = 'info/LOAD_SUCCESS'
const LOAD_FAIL = 'info/LOAD_FAIL'

const initialState = {
  loaded: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        stuff: action.stuff,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {
  return globalState.info && globalState.info.loaded
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/api/loadInfo'),
    stuff: 'stuff',
  }
}

export const loadOne = () => {
  return {
    type: LOAD,
  }
}
