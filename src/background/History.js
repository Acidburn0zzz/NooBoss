import { waitFor, getDB, setDB } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(resolve => {
				getDB('history_records', (recordList) => {
					NooBoss.History.recordList = recordList || [];
					resolve();
				});
			});
		},
		addRecord: (record) => {
			return new Promise(async resolve => {
				// wait for a bit so that enable events come after install events
				//                        remove events come after disable events
				// somehow Chroem call these is a strange sequence
				if (record.event == 'removed' || record.event == 'enabled') {
					await waitFor(666);
				}
				record.date = new Date().getTime();
				NooBoss.History.recordList.push(record);
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		removeRecord: (index) => {
			return new Promise(resolve => {
				NooBoss.History.recordList.splice(index, 1);
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		empty: () => {
			return new Promise(resolve => {
				NooBoss.History.recordList = [];
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		onUpdate: () => {
		},
		listen: () => {
			browser.management.onInstalled.addListener(appInfo => {
			});
		},
	};
};
