import { formatDistance } from "date-fns";
import vi from "date-fns/locale/vi";

export default function formatDate(date) {
    return formatDistance(date, new Date(), {
        addSuffix: true,
        locale: vi,
    })
}