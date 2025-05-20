// vitest.config.ts or setupTests.js
import '@testing-library/jest-dom'; // matchers
import '@testing-library/react'; // includes cleanup if properly configured
global.getComputedStyle = () => ({
    getPropertyValue: () => '',
});
  // Patch for Ant Design's Modal portal rendering in JSDOM


  
  
  