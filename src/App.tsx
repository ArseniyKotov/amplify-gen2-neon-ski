import { Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resorts from './pages/Resorts';
import ResortDetail from './pages/ResortDetail';
import MyAdventures from './pages/MyAdventures';
import PlanAdventure from './pages/PlanAdventure';
import Profile from './pages/Profile';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-dark-base text-white">
          <Navbar user={user} signOut={signOut} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resorts" element={<Resorts />} />
              <Route path="/resorts/:id" element={<ResortDetail />} />
              <Route path="/my-adventures" element={<MyAdventures />} />
              <Route path="/plan" element={<PlanAdventure />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <footer className="border-t border-neon-blue/20 py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} NeonSki - Futuristic Skiing
                Adventure Planner
              </p>
            </div>
          </footer>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
