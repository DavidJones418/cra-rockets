import { useState } from 'react';
import useSWR from 'swr';
import './App.css';

async function fetcher(url: string) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	return await res.json();
}

function getYear(launch: { date_unix: number }) {
	return new Date(launch.date_unix * 1000).getUTCFullYear();
}

function App() {
	const { data: launches, mutate } = useSWR<{ id: string; name: string; date_unix: number }[]>(
		'https://api.spacexdata.com/v4/launches',
		fetcher,
	);

	const launchYears = new Set(launches?.map(getYear));

	const [filterYear, setFilterYear] = useState<number>(NaN);

	const [sortDirection, setSortDirection] = useState(1);

	return (
		<div className="App">
			<header className="App-header">
				<button onClick={() => mutate()}>Reload</button>
				<select
					onChange={(ev) => setFilterYear(Number(ev.currentTarget.value))}
					data-testid="filterByYear"
				>
					<option>Filter by Year</option>
					{[...launchYears].map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
				{sortDirection > 0 && <button onClick={() => setSortDirection(-1)}>Sort Descending</button>}
				{sortDirection < 0 && <button onClick={() => setSortDirection(+1)}>Sort Ascending</button>}
				<ol>
					{launches
						?.filter((launch) => !filterYear || getYear(launch) === filterYear)
						.sort((a, b) => sortDirection * (a.date_unix - b.date_unix))
						.map((launch, i) => (
							<li key={launch.id} data-testid={`launch-${i}`}>
								<span>{launch.name}</span> <span>({launch.date_unix})</span>
							</li>
						))}
				</ol>
			</header>
		</div>
	);
}

export default App;
