import React from 'react';
import NavBar from '../components/NavBar';

function HomePage() {
  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Welcome to Macromeal</h1>
        <p>
          Use the navigation above to manage your meal plans, view your profile,
          and create recipes. You can also log out at any time.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
