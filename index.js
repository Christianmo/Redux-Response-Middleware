function responseMiddleware() {
  const service = 'service';
  const success = 'success';
  const failure = 'failure';
  const response = 'response';
  const initialState = 'initialState';

  
  return () => next => (action) => {
    const hasProperty = property => Object.prototype.hasOwnProperty.call(action, property);

    if (hasProperty(service)) {
      if (typeof (action[service]) === 'object') {
        const data = `${action.target}Data`;
        const error = `${action.target}Error`;
        const loading = `${action.target}Loading`;

        const initialData = hasProperty(initialState) ? action[initialState] : false;

        const payload = {
          [data]: initialData,
          [error]: false,
          [loading]: false,
        };

        next({
          ...action,
          payload: { ...payload, [loading]: true },
        });

        action[service].then((resp) => {
          if (resp.status < 200 || resp.status > 299) {
            const error = new Error();
            error.error = resp;
            throw error;
          }

          next({
            ...action,
            payload: { ...payload, [data]: action[response](resp) },
          });

          if (hasProperty(success)) action[success]();

        }).catch((err) => {
          next({
            ...action,
            payload: { ...payload, [error]: err },
          });

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
