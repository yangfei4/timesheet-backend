import React from 'react';

const Pagenation = ({itemCounts, pageSize, currentPage, handlePageChange}) => {
    const pageCount = Math.ceil(itemCounts / pageSize);
    if(pageCount === 1) return null;
    const pages = [...Array(pageCount).keys()].map(i => i + 1);

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pages.map(page => (
                    <li key={page} className={page === currentPage ? "page-item active" : "page-item"}>
                        <a className="page-link" onClick={() => handlePageChange(page)}>{page}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
};

export default Pagenation;