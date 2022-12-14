//array containing alerts
import {SET_ALERT, REMOVE_ALERT} from '../actions/types'
const initialState = [];

export default function(state = initialState, action){
    //so that we don't have to say action.type, action.payload
    const {type, payload} = action;

    switch(type){
        case SET_ALERT:
            //...state returns any pre-exisiting alerts, action.payload is new alert
            return [...state, payload];
        case REMOVE_ALERT:
            //.filter to remove specific alert (returns all alerts except alert that matches payload)
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}