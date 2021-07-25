# Redux-Response-Middleware
Single Redux Middleware with Request/Success/Failure Pattern

## Installation

```
npm i redux-response-middleware --save
```

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

If the action has a `service` property you will receive corresponding props: data, error, loading, if these properties doesn't exist the action going to work as usually .

```javascript
import { GET_POSTS, ADD_POST } from '@constants/actionNames';
import postServices from '@services/postServices';

const getPostsTarget = 'posts';
const addPostsTarget = 'post';

const success = (response) => {
  console.log('success:', response);
};

const failure = (error) => {
  console.log('error', error);
};

const postActions = {
  getPosts: (success, failure) => ({
    type: GET_POSTS,
    target: getPostsTarget,
    service: postServices.getPosts,
    response: resp => resp.data,
    error: error => error.data,
    success,
    failure,
  }),
  addPost: (values, success, failure) => ({
    type: ADD_POST,
    target: addPostsTarget,
    service: postServices.addPost(values),
    response: resp => resp.data,
    error: error => error.data,
    success,
    failure,
  }),
};

export default postActions;
```

Option | Type | Description
------ | ---- | ------- 
type | String | You should send a type name to handle from your reducer.
service | Promise | You should send a promise, for example `axios.get('posts')`.
target | String | This is important to get good prop names, for example if `target: 'post'` you get props: postData, postError, postLoading.
initialState | * | The initial value ([], {}, '', etc)
response | Func (optional) | is a callback to handle the response route, for example if you have `data: { data: { title } } ` you could  use `resp => resp.data.data`, so that you can get in your redux state `postData: { title }` instead of `postData: data: { data: { title } }`.
error | Func (options) | Same as response option, but to handle errors.
success | Func (response) | The callback when the response is success.
failure | Func (error) | The callback when you get error
