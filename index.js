function responseMiddleware() {
  const service = 'service';
  const success = 'success';
  const failure = 'failure';

  return () => next => (action) => {
    if (Object.prototype.hasOwnProperty.call(action, service)) {
      if (typeof (action[service]) === 'object') {
        const data = `${action.target}Data`;
        const error = `${action.target}Error`;
        const loading = `${action.target}Loading`;

        const payload = {
          [data]: false,
          [error]: false,
          [loading]: false,
        };

        next({
          ...action,
          payload: { ...payload, [loading]: true },
        });

        action[service].then((resp) => {
          if (resp.status < 200 || resp.status > 299) {
            const error = new Errir(resp);
            return error;
          }

          next({
            ...action,
            payload: { ...payload, [data]: action.response(resp) },
          });

          if (Object.prototype.hasOwnProperty.call(action, success)) {
            action[success]();
          }
        }).catch((err) => {
          next({
            ...action,
            payload: { ...payload, [error]: err },
          });

          if (Object.prototype.hasOwnProperty.call(action, failure)) {
            action[failure]();
          }
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
