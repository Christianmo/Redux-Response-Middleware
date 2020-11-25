function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function responseMiddleware() {
  const service = "service";
  const success = "success";
  const failure = "failure";
  const response = "response";
  const initialState = "initialState";
  return () => next => action => {
    const hasProperty = property => Object.prototype.hasOwnProperty.call(action, property);

    if (hasProperty(service)) {
      if (typeof action[service] === "object") {
        const data = "".concat(action.target, "Data");
        const error = "".concat(action.target, "Error");
        const loading = "".concat(action.target, "Loading");
        const initialData = hasProperty(initialState) ? action[initialState] : false;
        const payload = {
          [data]: initialData,
          [error]: false,
          [loading]: false
        };
        next(_objectSpread(_objectSpread({}, action), {}, {
          payload: _objectSpread(_objectSpread({}, payload), {}, {
            [loading]: true
          })
        }));
        action[service].then(resp => {
          if (resp.status < 200 || resp.status > 299) {
            const error = new Error();
            error.error = resp;
            throw error;
          }

          next(_objectSpread(_objectSpread({}, action), {}, {
            payload: _objectSpread(_objectSpread({}, payload), {}, {
              [data]: action.response ? action[response](resp) : resp
            })
          }));
          if (hasProperty(success)) action[success](resp);
        }).catch(err => {
          next(_objectSpread(_objectSpread({}, action), {}, {
            payload: _objectSpread(_objectSpread({}, payload), {}, {
              [error]: action.error ? action.error(err) : err
            })
          }));
          if (hasProperty(failure)) action[failure](err);
        });
      } else {
        throw new Error("action.service should be a promise");
      }
    } else {
      next(action);
    }
  };
}

export default responseMiddleware;
