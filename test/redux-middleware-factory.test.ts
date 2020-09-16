import { AnyAction, applyMiddleware, createStore } from '@reduxjs/toolkit'

import { reduxMiddlewareFactory } from '../src/redux-middleware-factory'

type TestState = {
  value: number
}

const defaultState = {
  value: 0
}

enum ActionType {
  SET_ONE = 'SET_ONE',
  SET_TWO = 'SET_TWO',
  SET_THREE = 'TYPESET_THREE_THREE'
}

type TestAction = { type: ActionType }

export const reducer = (state = defaultState, action: TestAction) => {
  switch (action.type) {
    case ActionType.SET_ONE: {
      return { value: 1 }
    }
    case ActionType.SET_TWO: {
      return { value: 2 }
    }
    case ActionType.SET_THREE: {
      return { value: 3 }
    }
    default:
      return { ...state }
  }
}

const mappingMiddleware = reduxMiddlewareFactory<TestState, any>((_store, next, action) => {
  if (action.type === ActionType.SET_ONE) {
    return next({ type: ActionType.SET_THREE })
  } else {
    return next(action)
  }
})

describe('Maps an action of certain type to another type of action.', () => {
  const store = createStore(reducer, applyMiddleware(mappingMiddleware))

  it('Signature must match what redux expects', () => {
    store.dispatch({ type: ActionType.SET_TWO })
    expect(store.getState().value).toEqual(2)
    store.dispatch({ type: ActionType.SET_THREE })
    expect(store.getState().value).toEqual(3)
    store.dispatch({ type: ActionType.SET_TWO })
    expect(store.getState().value).toEqual(2)
    store.dispatch({ type: ActionType.SET_ONE })
    expect(store.getState().value).toEqual(3)
  })
})
