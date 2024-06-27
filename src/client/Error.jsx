import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {object} props
 * @param {string} props.error
 */
export default function Error({ error }) {
  return (
    <div>
      <h1>Application Error:</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.string
};
