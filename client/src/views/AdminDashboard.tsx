import { useInfiniteQuery } from 'react-query';
import { getFeedbackList } from '@/api/api';
import PaginatedTable from '@/components/PaginatedTable';

const colDefs = [
    { field: "type", filter: true, flex: 1 },
    { field: "comments", filter: true, flex: 2 },
    { field: "category", filter: true, flex: 1 },
    { field: "prompt", flex: 1 },
    { field: "response", flex: 1 }
];

function calculatePageSize() {
    const rowHeight = 41.2; // row height
    const headerHeight = 49; // header height
    const footerHeight = 80;
    const screenHeight = window.innerHeight;

    const availableHeight = screenHeight - headerHeight - footerHeight;
    const rowsPerPage = Math.floor(availableHeight / rowHeight);

    return rowsPerPage;
}

const LIMIT = calculatePageSize();

export default function AdminDashboard() {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: "feedbacks",
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getFeedbackList(pageParam, LIMIT);
            if (response.ok) {
                return await response.json();
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.nextPage
            }
            return undefined
        },
    });

    return <PaginatedTable colDefs={colDefs} data={data} limit={LIMIT} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
}