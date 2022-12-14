//////Reducers link to the Component we're working on (ex. Register) which call a method which links
//////to the actions file which is then linked to the component we're working on (ex. auth)
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED
  } from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  };

  export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
          return {
            ...state,
            isAuthenticated: true,
            loading: false,
            user: payload
          }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
          localStorage.setItem('token', payload.token);
              return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
              }
              case REGISTER_FAIL:
              case AUTH_ERROR:
              case LOGIN_FAIL:
              case LOGOUT:
              case ACCOUNT_DELETED:
                localStorage.removeItem('token');
                  return {
                    ...state,
                    token: null,
                    isAuthenticated: false,
                    loading: false
                  }
                default:
                  return state;
    }
}