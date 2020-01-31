/* eslint-disable import/no-cycle */
import React from 'react';
import Exception from '../Exception/index';
import CheckPermissions from './CheckPermissions';

const Exception403 = () => <Exception type="403" style={{ minHeight: 500, height: '80%' }} />;

const authorize = (authority, error) => {
  let classError = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(targer) {
    return () => CheckPermissions(authority, targer, classError || Exception403);
  };
};

export default authorize;
