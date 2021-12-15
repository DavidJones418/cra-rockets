import { fireEvent, render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { SWRConfig } from 'swr';
import App from './App';

const mockLaunches = [
	{ id: 'aaaaa', name: 'Mock 2006 Launch', date_unix: Number(new Date('2006-01-01')) / 1000 },
	{ id: 'bbbbb', name: 'Mock 2007 Launch', date_unix: Number(new Date('2007-01-01')) / 1000 },
	{ id: 'ccccc', name: 'Mock 2008 Launch', date_unix: Number(new Date('2008-01-01')) / 1000 },
];

const mockRockets = [{ name: 'Mock Rocket 1' }];

export const server = setupServer(
	rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockLaunches));
	}),
	rest.get('https://api.spacexdata.com/v4/rockets', (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockRockets));
	}),
);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Clean up after the tests are finished.
afterAll(() => server.close());

test('load the full list of SpaceX launches from the SpaceX API', async () => {
	render(<App />);
	expect(await screen.findByText('Mock 2006 Launch')).toBeInTheDocument();
	expect(await screen.findByText('Mock 2007 Launch')).toBeInTheDocument();
	expect(await screen.findByText('Mock 2008 Launch')).toBeInTheDocument();
});

test('reload the data to see any new changes', async () => {
	let cache = new Map();
	render(
		<SWRConfig value={{ provider: () => cache }}>
			<App />
		</SWRConfig>,
	);
	// Wait for the initial load to populate the SWR cache.
	await screen.findByText('Mock 2006 Launch');

	cache.clear();
	fireEvent.click(screen.getByText('Reload Data'));

	expect(cache).toEqual(new Map([['$req$https://api.spacexdata.com/v4/launches', true]]));
});

test('filter the launch list by year', async () => {
	render(<App />);
	const firstLaunch = await screen.findByText('Mock 2006 Launch');
	const secondLaunch = await screen.findByText('Mock 2007 Launch');
	const thirdLaunch = await screen.findByText('Mock 2008 Launch');

	fireEvent.change(screen.getByTestId('filterByYear'), { target: { value: '2007' } });

	expect(firstLaunch).not.toBeInTheDocument();
	expect(secondLaunch).toBeInTheDocument();
	expect(thirdLaunch).not.toBeInTheDocument();
});

test('sort all launches by date (ascending/descending)', async () => {
	render(<App />);
	expect(await screen.findByTestId('launch-0')).toHaveTextContent('Mock 2006 Launch');
	expect(await screen.findByTestId('launch-1')).toHaveTextContent('Mock 2007 Launch');
	expect(await screen.findByTestId('launch-2')).toHaveTextContent('Mock 2008 Launch');

	fireEvent.click(screen.getByText('Sort Descending'));

	expect(screen.getByTestId('launch-0')).toHaveTextContent('Mock 2008 Launch');
	expect(screen.getByTestId('launch-1')).toHaveTextContent('Mock 2007 Launch');
	expect(screen.getByTestId('launch-2')).toHaveTextContent('Mock 2006 Launch');
});
