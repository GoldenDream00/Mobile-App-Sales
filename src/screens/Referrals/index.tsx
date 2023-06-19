import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { t } from 'i18next';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@rneui/base';
import { formatNumber, getCurrencySymbol, shortenString } from '../../helpers/misc';
import { RefreshControl, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import { useGetCurrentUserQuery, useGetReferralCodeQuery } from '../../../redux/user/userApiSlice';
import Loader from '../../../components/Loader';
import Toast from 'react-native-root-toast';
import { hp, wp } from '../../../utils';
import { tintColorDark } from '../../../constants/Colors';

const periodSelectorData = [
	{
		label: 'Today',
		value: 'today',
	},
	{
		label: '7 days',
		value: '7d',
	},
	{
		label: '30 days',
		value: '30d',
	},
	{
		label: 'All Time',
		value: '',
	},
];

const Referrals = (props: any) => {
	const {
		data: referralData,
		isLoading: referralLoading,
		isFetching,
		refetch,
	} = useGetReferralCodeQuery();
	const { data: currentUser } = useGetCurrentUserQuery();

	const [selectedPeriod, setSelectedPeriod] = useState(periodSelectorData[2]);

	return (
		<View style={styles.container}>
			<Header title={t('Referrals')} />

			{referralLoading ? (
				<Loader />
			) : (
				<>
					<Text style={styles.marketingText}>
						{t('Refer someone and earn')} <Text>5%</Text> {t('on each sale they make')}
					</Text>
					<View>
						<View style={styles.box}>
							<Text style={styles.boxText}>
								{shortenString(referralData?.referralCode, 35)}
							</Text>
							<TouchableOpacity
								style={{ padding: 4 }}
								onPress={async () => {
									Clipboard.setString(
										`https://app.popcard.io/join/${referralData?.referralCode}`
									);
									if (
										(await Clipboard.getString()) ===
										`https://app.popcard.io/join/${referralData?.referralCode}`
									) {
										Toast.show(`✅ ${t('Copied to clipboard')}`, {
											position: Toast.positions.CENTER,
										});
									}
								}}
							>
								<Icon name="content-copy" />
							</TouchableOpacity>
							<TouchableOpacity
								style={{ padding: 4 }}
								onPress={() =>
									Share.share({
										message: `${t(
											'Become a verified Popcard Seller today! Join using my code'
										)}: ${referralData?.referralCode}`,
										url: `https://app.popcard.io/join/${referralData?.referralCode}`,
									})
								}
							>
								<Icon name="share" />
							</TouchableOpacity>
						</View>
					</View>
					<ScrollView
						style={styles.listContainer}
						refreshControl={
							<RefreshControl refreshing={isFetching} onRefresh={refetch} />
						}
					>
						{/* <Text style={styles.listTitle}>{t('Referral Stats')}</Text> */}
						<View style={styles.periodSelectorContainer}>
							{periodSelectorData?.map((item: any, index: number) => {
								return (
									<TouchableOpacity
										key={index}
										onPress={() => setSelectedPeriod(item)}
										style={[
											styles.periodSelectorItem,
											selectedPeriod?.label == item?.label &&
												styles.periodSelectorItemSelected,
										]}
									>
										<Text
											style={[
												styles.periodSelectorItemText,
												selectedPeriod?.label == item?.label &&
													styles.periodSelectorItemTextSelected,
											]}
										>
											{t(item?.label)}
										</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						<View style={styles.salesDataPointsContainer}>
							<View style={styles.salesDataPointItem}>
								<Text style={styles.salesDataPointItemLabel}>
									{t('Users Referred')}
								</Text>
								<Text style={styles.salesDataPointItemValue}>
									{formatNumber(referralData?.stats?.paid?.amount ?? 0)}
								</Text>
							</View>
							<View style={styles.salesDataPointItem}>
								<Text style={styles.salesDataPointItemLabel}>
									{t('Pending Commission')}
								</Text>
								<Text
									style={[
										styles.salesDataPointItemValue,
									]}
								>
									{getCurrencySymbol(currentUser?.currency)}
									{formatNumber(referralData?.stats?.unpaid?.amount ?? 0)}
								</Text>
							</View>

							<View style={styles.salesDataPointItem}>
								<Text style={styles.salesDataPointItemLabel}>
									{t('Earned Commission')}
								</Text>
								<Text
									style={[
										styles.salesDataPointItemValue,
									]}
								>
									{getCurrencySymbol(currentUser?.currency)}
									{formatNumber(referralData?.stats?.unpaid?.amount ?? 0)}
								</Text>
							</View>
							<View style={styles.salesDataPointItem}>
								<Text style={styles.salesDataPointItemLabel}>
									{t('Pending Commission')}
								</Text>
								<Text
									style={[
										styles.salesDataPointItemValue,
									]}
								>
									{getCurrencySymbol(currentUser?.currency)}
									{formatNumber(referralData?.stats?.unpaid?.amount ?? 0)}
								</Text>
							</View>
							
						</View>
					</ScrollView>
				</>
			)}
		</View>
	);
};

export default Referrals;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	marketingText: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	box: {
		backgroundColor: '#ddd',
		padding: 10,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		justifyContent: 'center',
		marginHorizontal: 20,
	},
	boxText: {
		fontSize: 11,
		textAlign: 'center',
		fontStyle: 'italic',
	},
	listContainer: {
		padding: 25,
	},
	listTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	periodSelectorContainer: {
		height: hp(4),
		marginBottom: hp(1),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		// backgroundColor: tintColorDark,
		borderRadius: wp(1.5),
	},
	periodSelectorItem: {
		paddingVertical: hp(1),
		paddingHorizontal: wp(4),
		borderRadius: wp(1),
		// marginLeft: wp(5),
	},
	periodSelectorItemSelected: {
		backgroundColor: '#ffbf003c',
	},
	periodSelectorItemText: {
		color: tintColorDark,
		fontSize: hp(1.5),
		fontWeight: '700',
	},
	periodSelectorItemTextSelected: {
		color: '#ff7b00',
	},
	salesDataPointsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginBottom: hp(2),
		flexWrap: 'wrap'
	},
	salesDataPointItem: {
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 15,
		borderRadius: 10,
		marginBottom: hp(1),
		minWidth: wp(40),
	},
	salesDataPointItemLabel: {
		fontSize: hp(1.2),
		fontWeight: '600',
		color: '#999',
		textTransform: 'uppercase',
	},
	salesDataPointItemValue: {
		fontSize: hp(4),
		fontWeight: '500',
	},
	salesDataPointItemValueUnpaid: {
		color: '#d50015',
	},
	salesDataPointDivider: {
		backgroundColor: '#ccc',
		width: 1,
		height: hp(4.5),
	},
});
