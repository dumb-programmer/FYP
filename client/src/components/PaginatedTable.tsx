import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';

export default function PaginatedTable({ colDefs, data, limit, hasNextPage, isFetchingNextPage, fetchNextPage, }: { colDefs: unknown[], data?: unknown, limit: number, hasNextPage?: boolean, isFetchingNextPage?: boolean, fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<any, unknown>> }) {
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
        } else if (data?.pages && page < data.pages.length - 1 && !isFetchingNextPage) {
            setPage(page => page + 1);
        }
    }

    const onPrevious = () => {
        if (page > 0) {
            setPage(page => page - 1);
        }
    }

    const start = page === 0 ? page + 1 : page * limit + 1;
    const end = start + data?.pages[page].rows.length - 1;
    const total = data?.pages[0].total;



    return <div className="ag-theme-quartz relative h-full">
        <div className="h-full pb-9">
            <AgGridReact
                rowData={data?.pages[page]?.rows}
                columnDefs={colDefs}
            />
        </div>
        <div className="absolute bottom-0 h-10 w-full flex items-center justify-end gap-4 bg-white border border-gray-300 pr-5">
            <p>{start}-{end} of {total}</p>
            <button className="btn btn-sm btn-ghost" onClick={onPrevious} disabled={page === 0}><ChevronLeftIcon height={20} width={20} /></button>
            <button className="btn btn-sm btn-ghost" onClick={onNext} disabled={data && !hasNextPage && page === data.pages.length - 1}><ChevronRightIcon height={20} width={20} /></button>
        </div>
    </div>
}