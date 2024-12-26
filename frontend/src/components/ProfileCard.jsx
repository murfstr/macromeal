// src/components/ProfileCard.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ProfileCard({ title, details, editButton }) {
  return (
    <Card className="shadow">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body>
        {details.map((detail, index) => (
          <Row className="mb-3" key={index}>
            <Col xs={4} className="text-end">
              <i className={`${detail.icon} fa-lg text-${detail.iconColor}`}></i>
            </Col>
            <Col xs={8}>
              <h5>{detail.label}</h5>
              <p>{detail.value}</p>
            </Col>
          </Row>
        ))}
      </Card.Body>
      {editButton && (
        <Card.Footer className="text-end">
          <Button variant="outline-primary" onClick={editButton.onClick}>
            <i className="fas fa-edit me-2"></i>Edit Profile
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}

ProfileCard.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      iconColor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  editButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }),
};

ProfileCard.defaultProps = {
  editButton: null,
};

export default ProfileCard;
