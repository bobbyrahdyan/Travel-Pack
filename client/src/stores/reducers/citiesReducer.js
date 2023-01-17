import { FETCH_CITIES, FETCH_CITY } from "../actions/actionType"

const initiateState = {
  cities: [],
  city: {}
}

export default function citiesReducer(state = initiateState, action) {
  switch (action.type) {
    case FETCH_CITIES:
      return { ...state, cities: action.payload }
    case FETCH_CITY:
      return { ...state, city: action.payload }
    default:
      return state
  }
}