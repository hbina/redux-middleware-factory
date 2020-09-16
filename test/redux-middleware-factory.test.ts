import {
  Action,
  AnyAction,
  applyMiddleware,
  createStore,
  Reducer,
  ThunkDispatch
} from '@reduxjs/toolkit'

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

export const reducer: Reducer<TestState, any> = (state = defaultState, action) => {
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

// A middleware that simply maps `ActionType.SET_ONE` to `ActionType.SET_THREE`.
const mappingMiddleware = reduxMiddlewareFactory<TestState>((_store, next, action) => {
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

// If we want to have an async middleware, we have to loosen up the type here.
// Namely, `action` must be `any`.
const asyncMiddleware = reduxMiddlewareFactory<TestState, any>((store, next, action) => {
  if (typeof action === 'function') {
    action(store.dispatch, action)
    return action
  }
  return next(action)
})

export const asyncAction: (
  a: ActionType
) => (b: ThunkDispatch<TestState, undefined, Action>) => Promise<void> = type => {
  return async dispatch => {
    switch (type) {
      case ActionType.SET_ONE: {
        dispatch({ type: ActionType.SET_ONE })
        break
      }
      case ActionType.SET_TWO: {
        dispatch({ type: ActionType.SET_TWO })
        break
      }
      case ActionType.SET_THREE: {
        dispatch({ type: ActionType.SET_THREE })
        break
      }
    }
  }
}

describe('Execute a thunk.', () => {
  const store = createStore(reducer, applyMiddleware(asyncMiddleware, mappingMiddleware))

  it('Execute a bunch of thunks', () => {
    store.dispatch(asyncAction(ActionType.SET_TWO))
    expect(store.getState().value).toEqual(2)
    store.dispatch(asyncAction(ActionType.SET_THREE))
    expect(store.getState().value).toEqual(3)
    store.dispatch(asyncAction(ActionType.SET_TWO))
    expect(store.getState().value).toEqual(2)
    store.dispatch(asyncAction(ActionType.SET_ONE))
    expect(store.getState().value).toEqual(3)
  })
})
