import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const ResortDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResort = async () => {
      if (!id) return;
      
      try {
        const { data, errors } = await client.models.Resort.get({ id });
        
        if (errors) {
          throw new Error(errors[0].message);
        }
        
        setResort(data);
      } catch (err) {
        console.error('Error fetching resort:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch resort details'));
      } finally {
        setLoading(false);
      }
    };

    fetchResort();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-neon-blue/30"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-neon-blue/30 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neon-blue/20 rounded"></div>
              <div className="h-4 bg-neon-blue/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resort) {
    return (
      <div className="cyber-card p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-500">Error Loading Resort</h2>
        <p className="mb-4">{error?.message || 'Resort not found'}</p>
        <Link to="/resorts" className="cyber-button">
          Back to Resorts
        </Link>
      </div>
    );
  }

  const difficultyColor = 
    resort.difficulty === 'BEGINNER' ? 'bg-green-900/30 text-green-400' :
    resort.difficulty === 'INTERMEDIATE' ? 'bg-blue-900/30 text-blue-400' :
    resort.difficulty === 'ADVANCED' ? 'bg-orange-900/30 text-orange-400' :
    'bg-red-900/30 text-red-400';

  return (
    <div>
      <div className="mb-6">
        <Link to="/resorts" className="text-neon-blue hover:text-neon-blue/80 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Resorts
        </Link>
      </div>

      <div className="relative h-[40vh] rounded-lg overflow-hidden mb-8">
        <img 
          src={resort.imageUrl} 
          alt={resort.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-4xl font-bold mb-2 neon-text">{resort.name}</h1>
          <p className="text-xl text-gray-300">{resort.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="cyber-card p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 neon-text">About</h2>
            <p className="text-gray-300 mb-6">{resort.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Elevation</p>
                <p className="text-xl font-bold text-neon-blue">{resort.elevation}m</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Trails</p>
                <p className="text-xl font-bold text-neon-blue">{resort.numberOfTrails}</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className={`text-xl font-bold ${
                  resort.difficulty === 'BEGINNER' ? 'text-green-400' :
                  resort.difficulty === 'INTERMEDIATE' ? 'text-blue-400' :
                  resort.difficulty === 'ADVANCED' ? 'text-orange-400' :
                  'text-red-400'
                }`}>{resort.difficulty}</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Rating</p>
                <div className="flex justify-center text-neon-yellow">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card p-6">
            <h2 className="text-2xl font-bold mb-4 neon-text">Trail Map</h2>
            <div className="aspect-[16/9] bg-dark-medium rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Interactive trail map coming soon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="cyber-card p-6 mb-8 sticky top-4">
            <h2 className="text-xl font-bold mb-4 neon-text">Plan Your Adventure</h2>
            <p className="text-gray-300 mb-6">
              Ready to hit the slopes at {resort.name}? Create a new adventure now!
            </p>
            <Link 
              to={`/plan?resortId=${resort.id}`} 
              className="cyber-button w-full text-center py-3 block mb-4"
            >
              Plan Adventure
            </Link>
            <div className="border-t border-neon-blue/20 pt-4 mt-4">
              <h3 className="text-lg font-bold mb-2">Resort Highlights</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{resort.numberOfTrails} Trails of Varying Difficulty</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Elevation of {resort.elevation}m</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Perfect for {resort.difficulty.toLowerCase()} skiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Stunning views and amenities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDetail;
