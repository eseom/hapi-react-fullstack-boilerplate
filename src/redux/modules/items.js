// @flow

const LOAD = 'items/LOAD';
const LOAD_SUCCESS = 'items/LOAD_SUCCESS';
const LOAD_FAIL = 'items/LOAD_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.items && globalState.items.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get('/api/items'), // params not used, just shown as demonstration
  };
}
