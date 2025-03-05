/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const Resorts: React.FC = () => {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const { data, errors } = await client.models.Resort.list();

        if (errors) {
          throw new Error(errors[0].message);
        }

        if (data.length === 0) {
          // Seed with mock data if no resorts exist
          await seedResorts();
          const { data: seededData } = await client.models.Resort.list();
          setResorts(seededData);
        } else {
          setResorts(data);
        }
      } catch (err) {
        console.error('Error fetching resorts:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch resorts')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResorts();
  }, []);

  const seedResorts = async () => {
    const mockResorts = [
      {
        name: 'Cyber Peak',
        location: 'Colorado, USA',
        description:
          'Experience the future of skiing at Cyber Peak. With cutting-edge facilities and breathtaking views, this resort offers an unparalleled adventure for advanced skiers.',
        elevation: 3500,
        numberOfTrails: 45,
        difficulty: 'ADVANCED',
        imageUrl:
          'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      },
      {
        name: 'Neon Valley',
        location: 'British Columbia, Canada',
        description:
          "Neon Valley is a winter wonderland for intermediate skiers. With a perfect blend of challenging and accessible trails, it's the ideal destination for those looking to improve their skills.",
        elevation: 2800,
        numberOfTrails: 38,
        difficulty: 'INTERMEDIATE',
        imageUrl:
          'https://images.unsplash.com/photo-1611001716885-b3402558a62b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      },
      {
        name: 'Quantum Ridge',
        location: 'Alps, Switzerland',
        description:
          "Only for the most daring skiers, Quantum Ridge offers extreme slopes and unmatched thrills. With its challenging terrain and pristine snow conditions, it's a paradise for experts.",
        elevation: 4200,
        numberOfTrails: 30,
        difficulty: 'EXPERT',
        imageUrl:
          'https://images.unsplash.com/photo-1548777123-e216912df7d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      },
      {
        name: 'Digital Slopes',
        location: 'Hokkaido, Japan',
        description:
          'Perfect for beginners, Digital Slopes offers gentle inclines and excellent instruction. Start your skiing journey in this picturesque Japanese resort.',
        elevation: 1800,
        numberOfTrails: 25,
        difficulty: 'BEGINNER',
        imageUrl:
          'https://images.unsplash.com/photo-1551524559-a3fb5b5ecd3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      },
      {
        name: 'Pixel Peaks',
        location: 'Queenstown, New Zealand',
        description:
          'A versatile resort offering trails for all skill levels. Pixel Peaks is known for its stunning scenery and excellent snow quality throughout the season.',
        elevation: 2300,
        numberOfTrails: 42,
        difficulty: 'INTERMEDIATE',
        imageUrl:
          'https://images.unsplash.com/photo-1517933165749-5bbd7f2b5b0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      },
      {
        name: 'Synthwave Summit',
        location: 'Aspen, USA',
        description:
          'Combining luxury with adventure, Synthwave Summit is a premier destination for advanced skiers looking for both challenging slopes and upscale amenities.',
        elevation: 3200,
        numberOfTrails: 50,
        difficulty: 'ADVANCED',
        imageUrl:
          'https://images.unsplash.com/photo-1612450622914-f1738c2f7cd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      },
    ];

    for (const resort of mockResorts) {
      //@ts-ignore
      await client.models.Resort.create(resort);
    }
  };

  const filteredResorts =
    filter === 'ALL'
      ? resorts
      : resorts.filter((resort) => resort.difficulty === filter);

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
        <h2 className="text-xl font-bold mb-4 text-red-500">
          Error Loading Resorts
        </h2>
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
        <h1 className="text-3xl font-bold mb-4 md:mb-0 neon-text">
          Ski Resorts
        </h1>

        <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map(
            (difficulty) => (
              <button
                key={difficulty}
                onClick={() => setFilter(difficulty)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  filter === difficulty
                    ? 'bg-neon-blue text-dark-base font-medium'
                    : 'bg-dark-medium text-gray-300 hover:bg-dark-light'
                }`}
              >
                {difficulty === 'ALL' ? 'All Resorts' : difficulty}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResorts.map((resort) => (
          <Link key={resort.id} to={`/resorts/${resort.id}`}>
            <div className="cyber-card h-full overflow-hidden transition-transform hover:scale-[1.02] duration-300">
              <div className="h-48 relative">
                <img
                  src={resort.imageUrl}
                  alt={resort.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-base to-transparent p-4">
                  <h3 className="font-bold text-lg">{resort.name}</h3>
                  <p className="text-sm text-gray-300">{resort.location}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      resort.difficulty === 'BEGINNER'
                        ? 'bg-green-900/30 text-green-400'
                        : resort.difficulty === 'INTERMEDIATE'
                        ? 'bg-blue-900/30 text-blue-400'
                        : resort.difficulty === 'ADVANCED'
                        ? 'bg-orange-900/30 text-orange-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {resort.difficulty}
                  </span>
                  <span className="text-sm text-gray-400">
                    {resort.numberOfTrails} Trails
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {resort.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Resorts;
