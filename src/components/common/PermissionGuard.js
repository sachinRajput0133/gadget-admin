import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * PermissionGuard component
 * 
 * A component that conditionally renders its children based on whether
 * the current user has the required permission(s).
 * 
 * @param {Object} props
 * @param {string|string[]} props.permissionRequired - Single permission code or array of permission codes
 * @param {boolean} props.requireAll - If true, user must have ALL permissions when an array is provided (default: false)
 * @param {React.ReactNode} props.children - Content to render if user has permission
 * @param {React.ReactNode} props.fallback - Optional content to render if user lacks permission
 */
const PermissionGuard = ({ 
  permissionRequired, 
  requireAll = false, 
  children, 
  fallback = null 
}) => {
  const { user } = useSelector((state) => state.auth);
  
  // No user logged in
  if (!user || !user.role || !user.role.permissions) {
    return fallback;
  }
  
  // Super Admin bypass - has all permissions
  if (user.role.name === 'Super Admin') {
    return children;
  }
  
  const userPermissions = user.role.permissions.map(permission => 
    typeof permission === 'object' ? permission.code : permission
  );
  
  // Check for required permissions
  let hasPermission = false;
  
  if (Array.isArray(permissionRequired)) {
    if (requireAll) {
      // User must have ALL permissions in the array
      hasPermission = permissionRequired.every(permission => 
        userPermissions.includes(permission)
      );
    } else {
      // User must have ANY permission in the array
      hasPermission = permissionRequired.some(permission => 
        userPermissions.includes(permission)
      );
    }
  } else {
    // Single permission check
    hasPermission = userPermissions.includes(permissionRequired);
  }
  
  return hasPermission ? children : fallback;
};

PermissionGuard.propTypes = {
  permissionRequired: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  requireAll: PropTypes.bool,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default PermissionGuard;
