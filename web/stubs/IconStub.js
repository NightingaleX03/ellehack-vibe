import React from 'react';
import {Text} from 'react-native-web';

// Simple stub for icon components - just renders the icon name as text
function IconStub({name, size = 24, color = '#000', ...props}) {
  return (
    <Text style={{fontSize: size, color}} {...props}>
      {name || '•'}
    </Text>
  );
}

// Create a function that returns an icon component (for createIconSet compatibility)
function createIconSet(glyphMap, fontFamily, fontFile) {
  return IconStub;
}

// Default export
export default IconStub;

// Named export for MaterialCommunityIcons
export const MaterialCommunityIcons = IconStub;

// Export createIconSet function
export {createIconSet};

