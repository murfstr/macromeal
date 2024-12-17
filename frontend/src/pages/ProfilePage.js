import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Calorie Target: {profile.profile.calorie_target}</p>
      <p>Dietary Restrictions: {profile.profile.dietary_restrictions || 'None'}</p>
    </div>
  );
}

export default ProfilePage;
