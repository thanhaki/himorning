import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import ElectronicItem from './electronic-item.component';
import Grid from '@mui/material/Grid';
import { ROWS_PER_PAGE_OPTIONS } from '../../../consts/constsCommon';

// Example items, to simulate fetching from another resources.
// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

function ListMenus({ currentItems, inforDonVi }) {
    return (
        <>
            {currentItems &&
                currentItems.map((matHang, index) => (
                    <ElectronicItem matHang={matHang} key={index} inforDonVi={inforDonVi} />

                ))}
        </>
    );
}

function PaginatedItems({items, inforDonVi }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + ROWS_PER_PAGE_OPTIONS;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(items?.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(items?.length / ROWS_PER_PAGE_OPTIONS));
    }, [itemOffset, ROWS_PER_PAGE_OPTIONS, items]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * ROWS_PER_PAGE_OPTIONS) % items?.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };
    console.log("pageCount", pageCount);
    return (
        <>
            <ListMenus currentItems={currentItems} inforDonVi={inforDonVi} />
            {pageCount > 1 && <Grid item xs={12} md={12}>
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </Grid>}
        </>
    );
}
export default PaginatedItems;
