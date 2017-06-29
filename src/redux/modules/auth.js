const LOAD = 'auth/LOAD'
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS'
const LOAD_FAIL = 'auth/LOAD_FAIL'
const LOGIN = 'auth/LOGIN'
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'auth/LOGIN_FAIL'
const LOGOUT = 'auth/LOGOUT'
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL'

const initialState = {
  loaded: false,
}

export default function reducer(state = initialState, action = {}) {
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
        user: action.result,
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
      }
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result,
        loginError: null,
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error,
      }
    case LOGOUT:
      return {
        ...state,
        loggingOut: true,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error,
      }
    default:
      return state
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get('/api/load-auth'),
  }
}

export function login(email, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post('/api/login', {
      data: {
        email,
        password,
      },
    }),
  }
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: client => client.get('/api/logout'),
  }
}
