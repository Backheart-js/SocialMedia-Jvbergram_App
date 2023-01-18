import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from '~/App';
import { Provider } from 'react-redux';
import store from '~/redux/store';
import { firebase, FieldValue } from './lib/firebase';
import { FirebaseContext } from './context/firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
      <Provider store={store}>
        <App />
      </Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>
);