import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

export default function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return isLoggedIn ? <TabNavigator /> : <AuthNavigator />;
}
