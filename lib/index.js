"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function responseMiddleware() {
    var service = "service";
    var success = "success";
    var failure = "failure";
    var response = "response";
    var initialState = "initialState";
    return function () { return function (next) { return function (action) {
        var _a, _b;
        var hasProperty = function (property) {
            return Object.prototype.hasOwnProperty.call(action, property);
        };
        if (hasProperty(service)) {
            if (typeof action[service] === "object") {
                var data_1 = action.target + "Data";
                var error_1 = action.target + "Error";
                var loading = action.target + "Loading";
                var initialData = hasProperty(initialState)
                    ? action[initialState]
                    : false;
                var payload_1 = (_a = {},
                    _a[data_1] = initialData,
                    _a[error_1] = false,
                    _a[loading] = false,
                    _a);
                next(__assign(__assign({}, action), { payload: __assign(__assign({}, payload_1), (_b = {}, _b[loading] = true, _b)) }));
                action[service]
                    .then(function (resp) {
                    var _a;
                    if (resp.status < 200 || resp.status > 299) {
                        var error_2 = new Error();
                        error_2.error = resp;
                        throw error_2;
                    }
                    next(__assign(__assign({}, action), { payload: __assign(__assign({}, payload_1), (_a = {}, _a[data_1] = action.response ? action[response](resp) : resp, _a)) }));
                    if (hasProperty(success))
                        action[success](resp);
                })
                    .catch(function (err) {
                    var _a;
                    next(__assign(__assign({}, action), { payload: __assign(__assign({}, payload_1), (_a = {}, _a[error_1] = action.error ? action.error(err) : err, _a)) }));
                    if (hasProperty(failure))
                        action[failure](err);
                });
            }
            else {
                throw new Error("action.service should be a promise");
            }
        }
        else {
            next(action);
        }
    }; }; };
}
exports.default = responseMiddleware;
//# sourceMappingURL=index.js.map