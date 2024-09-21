import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

const BuggyComponent = () => {
  throw new Error('Test error');
};

test('renders fallback UI when there is an error', () => {
  render(
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/Sorry... there was an error!/i)).toBeInTheDocument();
});
