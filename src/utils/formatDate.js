import moment from 'moment';

export default function formatDate(time) {
    const elapsedTime = moment().valueOf() - time;
    return <span>{moment.duration(elapsedTime).humanize()} ago</span>;
}