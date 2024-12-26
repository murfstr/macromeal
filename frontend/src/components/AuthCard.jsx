// src/components/AuthCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function AuthCard({ title, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="container vh-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">{title}</h3>
              {children}
              {footerText && footerLink && footerLinkText && (
                <p className="text-center mt-3">
                  {footerText} <Link to={footerLink}>{footerLinkText}</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerText: PropTypes.string,
  footerLink: PropTypes.string,
  footerLinkText: PropTypes.string,
};

AuthCard.defaultProps = {
  footerText: '',
  footerLink: '',
  footerLinkText: '',
};

export default AuthCard;
