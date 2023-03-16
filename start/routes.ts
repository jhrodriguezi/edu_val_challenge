/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Endpoints without authentication and authorization
Route.group(() => {
  Route.post('/register', 'UsersController.registerUser');
  Route.post('/login', 'UsersController.loginUser');
}).prefix('/api/v1/users');

// Endpoints with authentication and authorization
Route.group(() => {
  Route.post('/logout', 'UsersController.logoutUser');
  Route.get('/list', 'UsersController.listUsersWithPagination');
  Route.get('/list/:id', 'UsersController.listUserById');
  Route.put('/update/:id', 'UsersController.updateUser');
}).prefix('/api/v1/users').middleware('auth');
  

Route.get('/', async () => {
  return { hello: 'world' }
})
