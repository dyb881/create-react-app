import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      account <Link to="/admin/account">go account</Link>
    </div>
  );
};
