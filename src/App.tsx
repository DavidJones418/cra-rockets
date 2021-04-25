import useSWR from 'swr';
import './App.css';

async function fetcher(url: string) {
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	return await res.json();
}

function App() {
	const { data: launches, mutate } = useSWR('https://api.spacexdata.com/v4/launches', fetcher);

	return (
		<div className="App">
			<header className="App-header">
				<button onClick={() => mutate()}>Reload</button>
				<ol>
					{launches?.map((launch: { id: string; name: string }) => (
						<li key={launch.id}>{launch.name}</li>
					))}
				</ol>
			</header>
		</div>
	);
}

export default App;
