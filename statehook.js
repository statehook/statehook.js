'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { define('statehook', [], factory); define('StateHook', [], factory); }
  if (typeof exports === 'object') module.exports = factory();
  if (!!root && typeof root === 'object') { root.statehook = root.StateHook = factory(); }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
  function createHook(state) {
    var undefined = (function _undefined() {})();
    var subscribers = [];
    var errorDiscarded = new Error('This hook has been discarded!');
    function discard() { state = undefined; subscribers = undefined; }
    function isDiscarded() { return subscribers === undefined; }
    function getState() { return state; }
    function setState(newState) {
      if (isDiscarded()) throw errorDiscarded;
      state = newState;
      return state;
    }
    function subscribe(suber) {
      if (isDiscarded()) throw errorDiscarded;
      subscribers.push(suber);
      return function unsubscribe() {
        if (subscribers && suber) subscribers.splice(subscribers.indexOf(suber), 1);
        suber = undefined;
      };
    }
    function dispatch() {
      if (isDiscarded()) throw errorDiscarded;
      for (var idx in subscribers) subscribers[idx].apply(this, arguments);
    }
    return { getState: getState, setState: setState, subscribe: subscribe, dispatch: dispatch, discard: discard };
  }
  return { createHook: createHook };
});
