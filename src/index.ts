import { Middleware } from 'redux';

function responseMiddleware() {
  const service = "service";
  const success = "success";
  const failure = "failure";
  const response = "response";
  const initialState = "initialState";

  const middleware: Middleware = () => next => action => {
    const hasProperty = (property: any) =>
      Object.prototype.hasOwnProperty.call(action, property);

    if (hasProperty(service)) {
      if (typeof action[service] === "object") {
        const data = `${action.target}Data`;
        const error = `${action.target}Error`;
        const loading = `${action.target}Loading`;

        const initialData = hasProperty(initialState)
          ? action[initialState]
          : false;

        const payload = {
          [data]: initialData,
          [error]: false,
          [loading]: false
        };

        next({
          ...action,
          payload: { ...payload, [loading]: true }
        });

        action[service]
          .then((resp: any) => {
            if (resp.status < 200 || resp.status > 299) {
              const error: Error = new Error();
              throw error;
            }

            next({
              ...action,
              payload: {
                ...payload,
                [data]: action.response ? action[response](resp) : resp
              }
            });

            if (hasProperty(success)) action[success](resp);
          })
          .catch((err: Error) => {
            next({
              ...action,
              payload: {
                ...payload,
                [error]: action.error ? action.error(err) : err
              }
            });

            if (hasProperty(failure)) action[failure](err);
          });
      } else {
        throw new Error("action.service should be a promise");
      }
    } else {
      next(action);
    }
  };

  return middleware;
}

export default responseMiddleware;
