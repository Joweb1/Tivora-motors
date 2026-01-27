import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Inventory from './pages/Inventory.tsx';
import VehicleDetails from './pages/VehicleDetails.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Admin from './pages/Admin.tsx';
import VoiceControl from './components/VoiceControl.tsx';
import ThemeGenerator from './components/ThemeGenerator.tsx';
import QuantumAnalyst from './components/QuantumAnalyst.tsx';
import DreamMachine from './components/DreamMachine.tsx';
import MotionStudio from './components/MotionStudio.tsx';
import Preloader from './components/Preloader.tsx';
import Cursor from './components/Cursor.tsx';
import { Vehicle } from './types.ts';
import { INITIAL_VEHICLES } from './constants.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [loading, setLoading] = useState(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('tivora_rides_inventory');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch (e) {
      console.error("Failed to parse inventory from localStorage", e);
      return INITIAL_VEHICLES;
    }
  });

  useEffect(() => {
    localStorage.setItem('tivora_rides_inventory', JSON.stringify(vehicles));
  }, [vehicles]);

  const handleAddVehicle = (newVehicle: Vehicle) => setVehicles([...vehicles, newVehicle]);
  const handleUpdateVehicle = (updatedVehicle: Vehicle) => setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  const handleDeleteVehicle = (id: string) => {
    if (confirm('Delete this listing?')) setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <>
      <div className="grain-overlay" />
      <Cursor />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-grid">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home featuredVehicles={vehicles.filter(v => v.featured)} />} />
              <Route path="/inventory" element={<Inventory vehicles={vehicles} />} />
              <Route path="/vehicle/:id" element={<VehicleDetails vehicles={vehicles} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin vehicles={vehicles} onAdd={handleAddVehicle} onUpdate={handleUpdateVehicle} onDelete={handleDeleteVehicle} />} />
            </Routes>
          </main>
          
          {/* AI Features Suite */}
          <VoiceControl />
          <ThemeGenerator />
          <DreamMachine />
          <MotionStudio />
          <QuantumAnalyst />
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;