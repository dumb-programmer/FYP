import { useInfiniteQuery } from 'react-query';
import PaginatedTable from '@/components/PaginatedTable';
import { LockOpenIcon, NoSymbolIcon, TrashIcon } from '@heroicons/react/16/solid';
import { blockUser, deleteUser, getUsersList, unblockUser } from '@/api/api';
import { useMemo, useRef, useState } from 'react';
import ConfirmationModal from '@/components/ConfirmationModal';

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

export default function AdminUsers() {
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
        queryKey: "feedbacks",
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getUsersList(pageParam, LIMIT);
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
    const deleteModalRef = useRef<HTMLDialogElement>(null);
    const blockModalRef = useRef<HTMLDialogElement>(null);
    const unblockModalRef = useRef<HTMLDialogElement>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const colDefs = useMemo(() => [
        { field: "firstName", filter: true, flex: 1 },
        { field: "lastName", filter: true, flex: 2 },
        { field: "email", filter: true, flex: 1 },
        { field: "username", flex: 1 },
        {
            field: "", flex: 1, cellRenderer: ({ data: { _id, isBlocked } }) => <div className="flex gap-2 justify-center m-2">
                <button className="btn btn-error btn-xs" onClick={() => {
                    setSelectedUserId(_id);
                    deleteModalRef.current?.showModal()
                }}>Delete <TrashIcon height={15} width={15} /></button>
                {
                    isBlocked ? <button
                        className="btn btn-accent btn-xs"
                        onClick={() => {
                            setSelectedUserId(_id);
                            unblockModalRef.current?.showModal();
                        }}>Unblock <LockOpenIcon height={15} width={15} /></button> :
                        <button
                            className="btn btn-accent btn-xs"
                            onClick={() => {
                                setSelectedUserId(_id);
                                blockModalRef.current?.showModal();
                            }}>Block <NoSymbolIcon height={15} width={15} /></button>
                }
            </div>
        }
    ], []);

    return <>
        <PaginatedTable colDefs={colDefs} data={data} limit={LIMIT} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
        <ConfirmationModal
            dialogRef={deleteModalRef}
            title="Delete user"
            description="Are you sure you want to delete this user? This action is non-recoverable"
            onPrimary={async () => {
                if (selectedUserId) {
                    const response = await deleteUser(selectedUserId);
                    if (response.ok) {
                        setSelectedUserId(null);
                        refetch();
                        deleteModalRef.current?.close();
                    }
                }
            }}
            onCancel={() => {
                deleteModalRef.current?.close()
                setSelectedUserId(null);
            }}
        />
        <ConfirmationModal
            dialogRef={blockModalRef}
            title="Block user"
            description="Are you sure you want to block this user?"
            primaryBtnClass="btn-primary"
            primaryBtnText="Block"
            onPrimary={async () => {
                if (selectedUserId) {
                    const response = await blockUser(selectedUserId);
                    if (response.ok) {
                        setSelectedUserId(null);
                        refetch();
                        blockModalRef.current?.close();
                    }
                }
            }}
            onCancel={() => {
                blockModalRef.current?.close()
                setSelectedUserId(null);
            }}
        />
        <ConfirmationModal
            dialogRef={unblockModalRef}
            title="Unblock user"
            description="Are you sure you want to unblock this user?"
            primaryBtnClass="btn-primary"
            primaryBtnText="Unblock"
            onPrimary={async () => {
                if (selectedUserId) {
                    const response = await unblockUser(selectedUserId);
                    if (response.ok) {
                        setSelectedUserId(null);
                        refetch();
                        unblockModalRef.current?.close();
                    }
                }
            }}
            onCancel={() => {
                unblockModalRef.current?.close()
                setSelectedUserId(null);
            }}
        />
    </>
}