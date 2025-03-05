import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [skillLevel, setSkillLevel] = useState('INTERMEDIATE');
  const [profilePicture, setProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { username } = await getCurrentUser();
        
        // Find user by username
        const { data: users, errors: userErrors } = await client.models.User.list({
          filter: { username: { eq: username } },
          limit: 1
        });
        
        if (userErrors) {
          throw new Error(userErrors[0].message);
        }
        
        // If user doesn't exist, create one
        if (users.length === 0) {
          const { data: newUser, errors: createErrors } = await client.models.User.create({
            username,
            email: username, // Using username as email for simplicity
            skillLevel: 'INTERMEDIATE', // Default skill level
            profilePicture: `https://api.dicebear.com/7.x/personas/svg?seed=${username}` // Generate avatar
          });
          
          if (createErrors) {
            throw new Error(createErrors[0].message);
          }
          
          setUser(newUser);
          setSkillLevel(newUser.skillLevel);
          setProfilePicture(newUser.profilePicture || '');
        } else {
          setUser(users[0]);
          setSkillLevel(users[0].skillLevel || 'INTERMEDIATE');
          setProfilePicture(users[0].profilePicture || `https://api.dicebear.com/7.x/personas/svg?seed=${username}`);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { data, errors } = await client.models.User.update({
        id: user.id,
        skillLevel,
        profilePicture
      });
      
      if (errors) {
        throw new Error(errors[0].message);
      }
      
      setUser(data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

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
        <h2 className="text-xl font-bold mb-4 text-red-500">Error Loading Profile</h2>
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
      <h1 className="text-3xl font-bold mb-8 neon-text">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="cyber-card p-6 text-center">
            <div className="mb-6 relative w-40 h-40 mx-auto">
              <img 
                src={profilePicture || `https://api.dicebear.com/7.x/personas/svg?seed=${user?.username}`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-neon-blue"
              />
              {isEditing && (
                <button 
                  className="absolute bottom-2 right-2 bg-dark-medium p-2 rounded-full border border-neon-blue"
                  onClick={() => {
                    const newAvatar = `https://api.dicebear.com/7.x/personas/svg?seed=${user?.username}-${Date.now()}`;
                    setProfilePicture(newAvatar);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neon-blue" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{user?.username}</h2>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            
            {!isEditing ? (
              <div className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-dark-medium text-neon-blue border border-neon-blue/30">
                  {skillLevel} Skier
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Skill Level</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="EXPERT">EXPERT</option>
                </select>
              </div>
            )}
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="cyber-button w-full"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 px-4 rounded border border-gray-500 text-gray-300 hover:bg-dark-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 cyber-button"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="cyber-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 neon-text">Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Adventures</p>
                <p className="text-2xl font-bold text-neon-blue">3</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Resorts Visited</p>
                <p className="text-2xl font-bold text-neon-blue">2</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Total Days</p>
                <p className="text-2xl font-bold text-neon-blue">14</p>
              </div>
              <div className="bg-dark-medium p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">Skill Level</p>
                <p className="text-2xl font-bold text-neon-blue">{skillLevel}</p>
              </div>
            </div>
          </div>
          
          <div className="cyber-card p-6">
            <h2 className="text-xl font-bold mb-4 neon-text">Recent Adventures</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-dark-medium p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Winter Adventure {index + 1}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/20 text-neon-blue">
                      {index === 0 ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(2023, 11 + index, 15).toLocaleDateString()} - {new Date(2023, 11 + index, 20).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {['Cyber Peak', 'Neon Valley', 'Quantum Ridge'][index]}
                    </span>
                    <button className="text-neon-blue hover:text-neon-blue/80 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
