import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// These entities contain the subset of properties of the real API used by the client.
const mockLaunches = [
	{ id: 'aaaaa', name: 'Mock First Launch', date_unix: Number(new Date('2006-01-01')) / 1000 },
	{ id: 'bbbbb', name: 'Mock Second Launch', date_unix: Number(new Date('2007-01-01')) / 1000 },
	{ id: 'ccccc', name: 'Mock Third Launch', date_unix: Number(new Date('2008-01-01')) / 1000 },
];

export const server = setupServer(
	rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockLaunches.slice(0, 2)));
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

	// Wait for initial load.
	await screen.findByText('Mock First Launch');

	// Another launch is added after the initial load.
	server.use(
		rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
			return res(ctx.status(200), ctx.json(mockLaunches.slice(0, 3)));
		}),
	);

	screen.getByText('Reload').click();
	expect(await screen.findByText('Mock Third Launch')).toBeInTheDocument();
});

test('filter the launch list by year', async () => {
	render(<App />);
	const firstLaunch = await screen.findByText('Mock First Launch');
	const secondLaunch = await screen.findByText('Mock Second Launch');

	fireEvent.change(screen.getByTestId('filterByYear'), { target: { value: '2006' } });

	expect(firstLaunch).toBeInTheDocument();
	expect(secondLaunch).not.toBeInTheDocument();
});
