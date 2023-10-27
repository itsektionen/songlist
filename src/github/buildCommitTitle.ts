import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function () {
	return dayjs().tz('Europe/Stockholm').format('[Build for changes made at] YYYY-MM-DD HH:mm:ss');
}
