import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <div className="relative h-[70vh] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-base/90 to-dark-base/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Skiing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
            NEON<span className="neon-text-pink">SKI</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Plan your next skiing adventure with futuristic precision
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/resorts" className="cyber-button text-center px-8 py-3">
              Explore Resorts
            </Link>
            <Link to="/plan" className="cyber-button text-center px-8 py-3">
              Plan Adventure
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="cyber-card p-6">
          <div className="h-12 w-12 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neon-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 neon-text">Discover Resorts</h3>
          <p className="text-gray-300">
            Explore top skiing destinations with detailed information about
            trails, elevation, and difficulty levels.
          </p>
        </div>

        <div className="cyber-card p-6">
          <div className="h-12 w-12 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neon-pink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 neon-text-pink">
            Plan Adventures
          </h3>
          <p className="text-gray-300">
            Create detailed skiing adventures with activities, gear lists, and
            invite friends to join you.
          </p>
        </div>

        <div className="cyber-card p-6">
          <div className="h-12 w-12 rounded-full bg-neon-green/20 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neon-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 neon-text-green">
            Track Progress
          </h3>
          <p className="text-gray-300">
            Monitor your skiing skill development and keep track of your
            adventures over time.
          </p>
        </div>
      </div>

      <div className="cyber-card p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 neon-text">Featured Resorts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: '1',
              name: 'Cyber Peak',
              location: 'Colorado, USA',
              difficulty: 'ADVANCED',
              image:
                'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
            },
            {
              id: '2',
              name: 'Neon Valley',
              location: 'British Columbia, Canada',
              difficulty: 'INTERMEDIATE',
              image:
                'https://images.unsplash.com/photo-1611001716885-b3402558a62b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            },
            {
              id: '3',
              name: 'Quantum Ridge',
              location: 'Alps, Switzerland',
              difficulty: 'EXPERT',
              image:
                'https://images.unsplash.com/photo-1548777123-e216912df7d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            },
          ].map((resort) => (
            <Link
              key={resort.id}
              to={`/resorts/${resort.id}`}
              className="block"
            >
              <div className="cyber-card h-full overflow-hidden transition-transform hover:scale-[1.02] duration-300">
                <div className="h-48 relative">
                  <img
                    src={resort.image}
                    alt={resort.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-base to-transparent p-4">
                    <h3 className="font-bold text-lg">{resort.name}</h3>
                    <p className="text-sm text-gray-300">{resort.location}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
                      {resort.difficulty}
                    </span>
                    <span className="text-sm text-gray-400">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
