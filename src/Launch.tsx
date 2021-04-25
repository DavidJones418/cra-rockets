import useSWR from 'swr';
import styles from './Launch.module.css';

function Launch({
	data,
}: {
	data: { name: string; date_unix: number; flight_number: number; rocket: string };
}) {
	// Load and cache all rockets: this makes one network request for all launches.
	const { data: rockets } = useSWR<{ id: string; name: string }[]>(
		'https://api.spacexdata.com/v4/rockets',
		(url) => fetch(url).then((res) => res.json()),
	);

	const rocket = rockets?.find((rocket) => rocket.id === data.rocket);

	return (
		<div className={styles.Launch}>
			<div className={styles.number}>{data.flight_number}</div>
			<div className={styles.name}>{data.name}</div>
			<div className={styles.date}>{new Date(data.date_unix * 1000).toLocaleDateString()}</div>
			<div className={styles.rocket}>{rocket?.name}</div>
		</div>
	);
}

export default Launch;
