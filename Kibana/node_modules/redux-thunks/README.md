# redux-thunks

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/redux-thunks/master/LICENSE)
[![Build Status](https://img.shields.io/travis/w33ble/redux-thunks.svg?branch=master)](https://travis-ci.org/w33ble/redux-thunks)
[![Coverage](https://img.shields.io/codecov/c/github/w33ble/redux-thunks.svg)](https://codecov.io/gh/w33ble/redux-thunks)
[![npm](https://img.shields.io/npm/v/redux-thunks.svg)](https://www.npmjs.com/package/redux-thunks)
![Project Status](https://img.shields.io/badge/status-stable-brightgreen.svg)

Simple thunk creator for redux.

This is meant to smooth over the use of [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-actions](https://github.com/acdlite/redux-actions). 

## Installation

```
$ yarn add redux-thunks redux-thunk
```

or

```
$ npm install --save redux-thunks redux-thunk
```

## Usage

This module is simply syntactic sugar for using `redux-thunk` with `redux-actions`. As such, it requires that you use the [redux-thunk](https://www.npmjs.com/package/redux-thunk) middleware.

### Add redux-thunk middleware

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
```

### Action definition

```js
import { createAction, handleAction } from 'redux-actions';
import { createThunk } from 'redux-thunks';

export const setAmount = createAction('SET_AMOUNT');

export const incrementAsync = createThunk('INCREMENT_ASYNC', ({ dispatch, getState }, amount) => {
  doAsyncMath(getState(), amount).then(val => dispatch(setAmount(val)));
});

// the reducer is attached to the action that is actually dispatched
export default handleAction(setAmount, (state, payload) => payload, 0);
```

The context also receives the type name that you gave the thunk, which is useful to using `createAction` inside of the handler function, so that the action type only needs to be defined once, like so:

```js
import { createAction, handleAction } from 'redux-actions';
import { createThunk } from 'redux-thunks';

export const resetAmountAsync = createThunk('RESET_AMOUNT', ({ dispatch, type }) => {
  // reset action. type is the value provided as the action type name, 'RESET_AMOUNT'
  const action = createAction(type);

  // read value from some async source and dispatch the reset action
  fetchAsyncValue().then(val => dispatch(action(val)));
});

// the reducer can use the exported thunk action directly
export default handleAction(resetAmountAsync, (state, payload) => payload, 0);
```

### Use in component/container

```js
dispatch(incrementAsync, 10); // adds 10
dispatch(resetAmountAsync); // resets the value
```

## API

### createThunk

#### `createThunk('type', ({ dispatch, getState, type }, [...args]))`

The syntax is very similar to that of `createAction`, and it smooths over the differences by similarly exposing a `toString` method on the thunk creator. 

`createThunk` takes two arguments, a type name, and a function to execute when the action is dispatched. The first argument of the function will be a context object, with the following properties:

name | description
---- | -----------
`dispatch` | Provided directly from `redux-thunk`, used to dispatch other actions
`getState` | Provided directly from `redux-thunk`, used to reach the current state
`type` | The type name of the action that was passed in as the first argument

 Any additional arguments will be anything specified at the dispatch call site. It's expected that at least one other action will be dispatched from the handler function.

#### License

MIT © [w33ble](https://github.com/w33ble)