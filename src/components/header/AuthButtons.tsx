import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const AuthButtons = () => {
  return (
    <div className="flex items-center gap-4">
      <button className="text-sm font-medium hover:text-gray-600">Sign In</button>
      <button className="text-sm font-medium hover:text-gray-600">Register</button>
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <UserCircleIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default AuthButtons;