import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes';
import uuidV4 from 'uuid/v4';

const App = () => (
  <Switch>
    {routes.map(route => (
      <Route key={uuidV4()} {...route} />
    ))}
  </Switch>
);

export default App;
