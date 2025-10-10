import React from 'react';
import Hero from '../components/Hero';
import DestinationList from '../components/DestinationList';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <DestinationList />
    </div>
  );
};

export default Home;