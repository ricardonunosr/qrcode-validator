import React from 'react';
import Modal from 'react-modal';

import ListQR from './components/ListQR';
import './App.css';

Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <ListQR />
    </div>
  );
}

export default App;
