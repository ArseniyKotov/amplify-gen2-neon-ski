/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const PlanAdventure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedResortId = searchParams.get('resortId');

  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [title, setTitle] = useState('');
  const [selectedResortId, setSelectedResortId] = useState(
    preselectedResortId || ''
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [activityType, setActivityType] = useState('SKI');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const { data, errors } = await client.models.Resort.list();

        if (errors) {
          throw new Error(errors[0].message);
        }

        setResorts(data);

        // If a resort was preselected and exists in the list, set it
        if (
          preselectedResortId &&
          data.some((resort) => resort.id === preselectedResortId)
        ) {
          setSelectedResortId(preselectedResortId);
        } else if (data.length > 0) {
          //@ts-ignore
          setSelectedResortId(data[0].id);
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

    // Set default dates (today and today + 5 days)
    const today = new Date();
    const fiveDaysLater = new Date();
    fiveDaysLater.setDate(today.getDate() + 5);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(fiveDaysLater.toISOString().split('T')[0]);
  }, [preselectedResortId]);

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities([...activities, `${activityType}: ${newActivity.trim()}`]);
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Get current user
      const { username } = await getCurrentUser();

      // Find or create user
      const { data: users, errors: userErrors } = await client.models.User.list(
        {
          filter: { username: { eq: username } },
          limit: 1,
        }
      );

      if (userErrors) {
        throw new Error(userErrors[0].message);
      }

      let userId;
      if (users.length === 0) {
        const { data: newUser, errors: createErrors } =
          await client.models.User.create({
            username,
            email: username, // Using username as email for simplicity
            skillLevel: 'INTERMEDIATE', // Default skill level
          });

        if (createErrors) {
          throw new Error(createErrors[0].message);
        }

        userId = newUser?.id;
      } else {
        userId = users[0].id;
      }

      // Create adventure
      const { data: adventure, errors: adventureErrors } =
        await client.models.Adventure.create({
          title,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          //@ts-ignore
          userId,
          resortId: selectedResortId,
        });

      if (adventureErrors) {
        throw new Error(adventureErrors[0].message);
      }

      // Create activities
      for (const activity of activities) {
        const [type, name] = activity.split(': ');

        await client.models.Activity.create({
          name,
          //@ts-ignore
          type,
          date: new Date(startDate).toISOString(),
          duration: 120, // Default 2 hours
          //@ts-ignore
          adventureId: adventure?.id,
        });
      }

      // Navigate to my adventures page
      navigate('/my-adventures');
    } catch (err) {
      console.error('Error creating adventure:', err);
      setSubmitError(
        err instanceof Error ? err : new Error('Failed to create adventure')
      );
    } finally {
      setSubmitting(false);
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
      <h1 className="text-3xl font-bold mb-8 neon-text">Plan Your Adventure</h1>

      <div className="cyber-card p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Adventure Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
              placeholder="Epic Ski Trip 2023"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="resort" className="block text-gray-300 mb-2">
              Select Resort
            </label>
            <select
              id="resort"
              value={selectedResortId}
              onChange={(e) => setSelectedResortId(e.target.value)}
              className="w-full bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
              required
            >
              {resorts.map((resort) => (
                <option key={resort.id} value={resort.id}>
                  {resort.name} - {resort.location}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Activities</label>
            <div className="flex gap-2 mb-2">
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
              >
                <option value="SKI">Skiing</option>
                <option value="SNOWBOARD">Snowboarding</option>
                <option value="LESSON">Lesson</option>
                <option value="APRES_SKI">Après-Ski</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="flex-1 bg-dark-medium border border-neon-blue/30 rounded p-3 text-white focus:border-neon-blue focus:outline-none"
                placeholder="Activity name"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="cyber-button"
              >
                Add
              </button>
            </div>

            {activities.length > 0 ? (
              <ul className="space-y-2 mt-4">
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-dark-medium p-3 rounded"
                  >
                    <span>{activity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mt-2">
                No activities added yet
              </p>
            )}
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded text-red-400">
              {submitError.message}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="cyber-button px-8 py-3"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Adventure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanAdventure;
