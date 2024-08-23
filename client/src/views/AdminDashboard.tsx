import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { getFeedbackList } from '@/api/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';


const colDefs = [
    { field: "type", filter: true, flex: 1 },
    { field: "comments", filter: true, flex: 2 },
    { field: "category", filter: true, flex: 1 },
    { field: "prompt", flex: 1 },
    { field: "response", flex: 1 }
];

function calculatePageSize() {
    const rowHeight = 41.2; // Adjust based on your table's row height
    const headerHeight = 49; // Adjust based on your table's header height
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
    const [page, setPage] = useState(0);

    const onNext = async () => {
        if (hasNextPage && !isFetchingNextPage) {
            if (!data?.pages[page + 1]) {
                await fetchNextPage();
                setPage(page => page + 1);
            }
            else {
                setPage(page => page + 1);
            }
        } else if (page < data?.pages.length - 1 && !isFetchingNextPage) {
            setPage(page => page + 1);
        }
    }

    const onPrevious = () => {
        if (page > 0) {
            setPage(page => page - 1);
        }
    }

    const start = page === 0 ? page + 1 : page * LIMIT + 1;
    const end = start + data?.pages[page].feedbacks.length - 1;
    const total = data?.pages[0].total;

    return <div className="min-h-screen w-screen flex">
        <aside className="menu prose relative p-10 bg-base-300 flex flex-col">
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Feedback</li>
                </ul>
            </nav>
        </aside>
        <main className="flex-1 p-4">
            <div className="ag-theme-quartz relative h-full">
                <div className="h-full pb-9">
                    <AgGridReact
                        rowData={data?.pages[page]?.feedbacks}
                        columnDefs={colDefs}
                    />
                </div>
                <div className="absolute bottom-0 h-10 w-full flex items-center justify-end gap-4 bg-white border border-gray-300 pr-5">
                    <p>{start}-{end} of {total}</p>
                    <button className="btn btn-sm btn-ghost" onClick={onPrevious} disabled={page === 0}><ChevronLeftIcon height={20} width={20} /></button>
                    <button className="btn btn-sm btn-ghost" onClick={onNext} disabled={!hasNextPage && page === data?.pages.length - 1}><ChevronRightIcon height={20} width={20} /></button>
                </div>
            </div>
        </main>
    </div>
}