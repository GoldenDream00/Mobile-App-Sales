import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../constants';
import { setAccessToken, setRefreshToken, logOut } from '../auth/authSlice';
import moment from 'moment';

const baseQuery = fetchBaseQuery({
	baseUrl: baseUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = getState()?.auth?.accessToken?.token;

		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result: any = '';
	console.log('token expires at', api.getState()?.auth?.accessToken?.expires);
	if (moment().isAfter(api.getState()?.auth?.accessToken?.expires)) {
		console.log('token expired, refreshing...', api.getState()?.auth?.refreshToken?.token);
		const refreshResult = await baseQuery(
			{
				url: '/auth/refresh-tokens',
				method: 'POST',
				body: {
					refreshToken: `${api.getState()?.auth?.refreshToken?.token}`,
				},
			},
			api,
			extraOptions
		);

		if (refreshResult?.data) {
			api.dispatch(setAccessToken(refreshResult?.data?.tokens?.access));
			api.dispatch(setRefreshToken(refreshResult?.data?.tokens?.refresh));
			result = await baseQuery(args, api, extraOptions);
			console.log(
				'refreshed token',
				refreshResult?.data?.tokens?.access,
				refreshResult?.data?.tokens?.refresh
			);
		} else if (refreshResult?.error) {
			api.dispatch(logOut());
			api.dispatch(apiSlice.util.resetApiState());
			console.log('refresh token error', refreshResult?.error);
		}
	} else {
		result = await baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Payouts'],
	endpoints: (builder) => ({}),
});
