function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function responseMiddleware() {
  const service = 'service';
  const success = 'success';
  const failure = 'failure';
  const response = 'response';
  const initialState = 'initialState';

  const hasProperty = property => Object.prototype.hasOwnProperty.call(action, property);

  return () => next => action => {
    if (hasProperty(service)) {
      if (typeof action[service] === 'object') {
        const data = "".concat(action.target, "Data");
        const error = "".concat(action.target, "Error");
        const loading = "".concat(action.target, "Loading");
        const initialData = hasProperty(initialData) ? action[initialState] : false;
        const payload = {
          [data]: initialData,
          [error]: false,
          [loading]: false
        };
        next(_objectSpread({}, action, {
          payload: _objectSpread({}, payload, {
            [loading]: true
          })
        }));
        action[service].then(resp => {
          if (resp.status < 200 || resp.status > 299) {
            const error = new Error();
            error.error = resp;
            throw error;
          }

          next(_objectSpread({}, action, {
            payload: _objectSpread({}, payload, {
              [data]: action[response](resp)
            })
          }));
          if (hasProperty(success)) action[success]();
        }).catch(err => {
          next(_objectSpread({}, action, {
            payload: _objectSpread({}, payload, {
              [error]: err
            })
          }));
          if (hasProperty(failure)) action[failure]();
        });
      } else {
        throw new Error('action.service should be a promise');
      }
    } else {
      next(action);
    }
  };
}

export default responseMiddleware;
