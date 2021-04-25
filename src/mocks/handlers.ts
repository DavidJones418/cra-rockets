import { rest } from 'msw';

export const handlers = [
	rest.get('https://api.spacexdata.com/v4/launches', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{ id: 'aaaaa', name: 'Mock First Launch' },
				{ id: 'zzzzz', name: 'Mock Last Launch' },
			]),
		);
	}),
];
