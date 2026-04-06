import { render, screen } from '@testing-library/react';
import { SignUpForm } from './SignUpForm';
import { describe, it, expect, vi } from 'vitest';

describe('SignUpForm', () => {
  it('renders correctly', () => {
    render(<SignUpForm onToggleToLogin={vi.fn()} />);
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });
});
