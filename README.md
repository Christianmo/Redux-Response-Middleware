# Redux-Response-Middleware
Single Redux Middleware with Request/Success/Failure Pattern

## Instalation


## Use

Add the middleware.

```javascript
import { combineReducers, createStore, applyMiddleware } from 'redux';

import users from '@redux/users/reducer';
import posts from '@redux/posts/reducer';
import responseMiddleware from '@redux/helpers/responseMiddleware';

const reducers = combineReducers({ users, posts });

export default createStore(reducers, applyMiddleware(responseMiddleware()));

```

If the action has a `service` property you will receive corresponding props: data, error, loading .

```javascript
import { GET_POSTS, ADD_POST } from '@constants/actionNames';
import postServices from '@services/postServices';

const getPostsTarget = 'posts';
const addPostsTarget = 'post';

const postActions = {
  getPosts: (success, failure) => ({
    type: GET_POSTS,
    target: getPostsTarget,
    service: postServices.getPosts,
    response: resp => resp.data,
    success,
    failure,
  }),
  addPost: (values, success, failure) => ({
    type: ADD_POST,
    target: addPostsTarget,
    service: postServices.addPost(values),
    response: resp => resp.data,
    success,
    failure,
  }),
};

export default postActions;
```

Option | Type | Description
------ | ---- | ------- 
service | Promise | You should send a promise, for example `axios.get('posts')`
target | String | This is important to get good prop names, for example if `target: 'post'` you get props: postData, postError, postLoading
success | Func | The callback when the response is success
failure | Func | The callback when you get error