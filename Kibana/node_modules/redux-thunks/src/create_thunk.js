export function createThunk(type, fn) {
  const actionCreator = (...args) => (dispatch, getState) => (
    fn({ dispatch, getState, type }, ...args)
  );

  // mimic redux-actions' .toString() functionality
  actionCreator.toString = () => type.toString();

  return actionCreator;
}
