import { useState } from 'react';
import useSWR from 'swr';
import styles from './App.module.css';
import Launch from './Launch';
import spaceXLogo from './spacex-logo.png';

function getYear(launch: { date_unix: number }) {
	return new Date(launch.date_unix * 1000).getUTCFullYear();
}

function App() {
	const { data: launches, mutate } = useSWR<
		{ id: string; name: string; date_unix: number; flight_number: number; rocket: string }[]
	>('https://api.spacexdata.com/v4/launches', (url) => fetch(url).then((res) => res.json()));

	const launchYears = new Set(launches?.map(getYear));

	const [filterYear, setFilterYear] = useState<number>(NaN);

	const [sortDirection, setSortDirection] = useState(1);

	return (
		<main className={styles.App}>
			<header className={styles.header}>
				<h1 className={styles.heading}>
					<img className={styles.headingLogo} src={spaceXLogo} alt="SpaceX" />
					Launches
				</h1>
				<div>
					<button className={styles.reloadButton} onClick={() => mutate()}>
						Reload Data
					</button>
				</div>
			</header>

			<div className={styles.controls}>
				<select
					className={styles.filterSelect}
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

				<button className={styles.sortButton} onClick={() => setSortDirection(-sortDirection)}>
					{sortDirection > 0 ? 'Sort Descending' : 'Sort Ascending'}
				</button>
			</div>

			<ol className={styles.launches}>
				{launches
					?.filter((launch) => !filterYear || getYear(launch) === filterYear)
					.sort((a, b) => sortDirection * (a.date_unix - b.date_unix))
					.map((launch, i) => (
						<li key={launch.id} data-testid={`launch-${i}`}>
							<Launch data={launch} />
						</li>
					))}
			</ol>
		</main>
	);
}

export default App;
