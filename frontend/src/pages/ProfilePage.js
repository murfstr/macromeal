import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
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

  if (!profile) return <div><NavBar /><p>Loading profile...</p></div>;

  return (
    <div>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Your Profile</h1>
        <p>Email: {profile.email}</p>
        <p>Calorie Target: {profile.profile.calorie_target}</p>
        <p>Dietary Restrictions: {profile.profile.dietary_restrictions || 'None'}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
