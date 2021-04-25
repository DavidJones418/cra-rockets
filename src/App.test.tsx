import { render, screen } from '@testing-library/react';
import App from './App';

test('loads the full list of SpaceX launches from the SpaceX API', async () => {
	render(<App />);
	expect(await screen.findByText('Mock First Launch')).toBeInTheDocument();
	expect(await screen.findByText('Mock Last Launch')).toBeInTheDocument();
});
