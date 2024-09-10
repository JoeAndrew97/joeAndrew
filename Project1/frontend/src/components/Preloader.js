// Preloader.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const Preloader = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: '9999',
      }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Preloader;
