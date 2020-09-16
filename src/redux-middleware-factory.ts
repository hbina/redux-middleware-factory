import { AnyAction, Dispatch, MiddlewareAPI } from '@reduxjs/toolkit'

export type MiddlewareFunction<
  S,
  A = AnyAction,
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>
> = (store: MiddlewareAPI<D, S>) => (next: D) => (action: A) => A

export const reduxMiddlewareFactory: <
  S,
  A = AnyAction,
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>
>(
  f: (store: MiddlewareAPI<D, S>, next: D, action: A) => A
) => MiddlewareFunction<S, A, D> = f => store => next => action => {
  return f(store, next, action)
}
