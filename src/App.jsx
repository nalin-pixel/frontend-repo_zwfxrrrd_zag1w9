import React from 'react';
import HeaderHero from './components/HeaderHero';
import MallMap from './components/MallMap';
import LegendBar from './components/LegendBar';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-25">
      <HeaderHero />
      <main className="flex-1">
        <MallMap />
      </main>
      <LegendBar />
    </div>
  );
}

export default App;
