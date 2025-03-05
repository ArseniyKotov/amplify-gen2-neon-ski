import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const MyAdventures: React.FC = () => {
  const [adventures, setAdventures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const { username } = await getCurrentUser();
        
        // Get the user by username
        const { data: users, errors: userErrors } = await client.models.User.list({
          filter: { username: { eq: username } },
          limit: 1
        });
        
        if (userErrors) {
          throw new Error(userErrors[0].message);
        }
        
        // If user doesn't exist, create one
        let userId;
        if (users.length === 0) {
          const { data: newUser, errors: createErrors } = await client.models.User.create({
            username,
            email: username, // Using username as email for simplicity
            skillLevel: 'INTERMEDIATE' // Default skill level
          });
          
          if (createErrors) {
            throw new Error(createErrors[0].message);
          }
          
          userId = newUser.id;
        } else {
          userId = users[0].id;
        }
        
        // Fetch adventures for this user
        const { data, errors } = await client.models.Adventure.list({
          filter: { userId: { eq: userId } }
        });
        
        if (errors) {
          throw new Error(errors[0].message);
        }
        
        // If no adventures, create a sample one
        if (data.length === 0) {
          // First get a resort
          const { data: resorts } = await client.models.Resort.list({ limit: 1 });
          
          if (resorts.length > 0) {
            const resort = resorts[0];
            
            // Create a sample adventure
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 30); // 30 days from now
            
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 5); // 5 day trip
            
            const { data: newAdventure } = await client.models.Adventure.create({
              title: 'My First Ski Trip',
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              userId,
              resortId: resort.id
            });
            
            setAdventures([newAdventure]);
          } else {
            setAdventures([]);
          }
        } else {
          setAdventures(data);
        }
      } catch (err) {
        console.error('Error fetching adventures:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch adventures'));
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, []);

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

  if (error) {
    return (
      <div className="cyber-card p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-500">Error Loading Adventures</h2>
        <p className="mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="cyber-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0 neon-text">My Adventures</h1>
        <Link to="/plan" className="cyber-button">
          Plan New Adventure
        </Link>
      </div>

      {adventures.length === 0 ? (
        <div className="cyber-card p-8 text-center">
          <h2 className="text-xl font-bold mb-4">No Adventures Yet</h2>
          <p className="text-gray-300 mb-6">
            You haven't planned any skiing adventures yet. Start planning your first adventure now!
          </p>
          <Link to="/plan" className="cyber-button">
            Plan Your First Adventure
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adventures.map(adventure => (
            <div key={adventure.id} className="cyber-card overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 neon-text">{adventure.title}</h3>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(adventure.startDate).toLocaleDateString()} - {new Date(adventure.endDate).toLocaleDateString()}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm px-2 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
                    {Math.ceil((new Date(adventure.endDate).getTime() - new Date(adventure.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                  </div>
                  <div className="text-sm text-gray-400">
                    {adventure.activities?.length || 0} Activities
                  </div>
                </div>
                
                <div className="border-t border-neon-blue/20 pt-4 mt-4">
                  <div className="flex justify-between">
                    <button className="text-neon-blue hover:text-neon-blue/80">
                      View Details
                    </button>
                    <button className="text-neon-pink hover:text-neon-pink/80">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAdventures;
