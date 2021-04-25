import { render, screen } from '@testing-library/react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
	rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{ id: 'aaaaa', name: 'Mock First Launch' },
				{ id: 'bbbbb', name: 'Mock Second Launch' },
			]),
		);
	}),
);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

test('load the full list of SpaceX launches from the SpaceX API', async () => {
	render(<App />);
	expect(await screen.findByText('Mock First Launch')).toBeInTheDocument();
	expect(await screen.findByText('Mock Second Launch')).toBeInTheDocument();
});

test('reload the data to see any new changes', async () => {
	render(<App />);

	// wait for initial load
	await screen.findByText('Mock First Launch');

	// another launch is added after the initial load
	server.use(
		rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
			return res(
				ctx.status(200),
				ctx.json([
					{ id: 'aaaaa', name: 'Mock First Launch' },
					{ id: 'bbbbb', name: 'Mock Second Launch' },
					{ id: 'ccccc', name: 'Mock Third Launch' },
				]),
			);
		}),
	);

	screen.getByText('Reload').click();
	expect(await screen.findByText('Mock Third Launch')).toBeInTheDocument();
});
