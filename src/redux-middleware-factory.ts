import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit'

export type MiddlewareFunction<
  S,
  R,
  A extends AnyAction = AnyAction,
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>
> = (store: MiddlewareAPI<D, S>) => (next: D) => (action: A) => R

export const reduxMiddlewareFactory: <
  S,
  R,
  A extends AnyAction = AnyAction,
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>
>(
  f: (store: MiddlewareAPI<D, S>, next: D, action: A) => R
) => MiddlewareFunction<S, R, A, D> = f => store => next => action => {
  return f(store, next, action)
}
