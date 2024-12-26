// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { getProfile } from '../services/api';
import { Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProfileCard from '../components/ProfileCard.jsx';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile. Please try again later.');
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading profile...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Container className="mt-5">
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  const profileDetails = [
    {
      icon: 'fas fa-envelope',
      iconColor: 'primary',
      label: 'Email',
      value: profile.email,
    },
    {
      icon: 'fas fa-bolt',
      iconColor: 'success',
      label: 'Calorie Target',
      value: `${profile.profile.calorie_target} kcal/day`,
    },
    {
      icon: 'fas fa-leaf',
      iconColor: 'warning',
      label: 'Dietary Restrictions',
      value: profile.profile.dietary_restrictions || 'None',
    },
  ];

  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <ProfileCard
              title="Your Profile"
              details={profileDetails}
              editButton={{
                onClick: () => navigateToEditProfile(),
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );

  function navigateToEditProfile() {
    toast.info('Edit Profile feature coming soon!');
  }
}

export default ProfilePage;
