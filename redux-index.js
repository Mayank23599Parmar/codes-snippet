import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/* Router */
import { BrowserRouter } from 'react-router-dom';

/* Redux */
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';

import AppContainer from './AppContainer';

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer >
          <PersistGate persistor={persistor}>

              <App />

          </PersistGate>
        </AppContainer>
      </BrowserRouter>
    </Provider>,
  document.getElementById('my-react')
);
