import { ITableProps } from "@/interface/base.interface";
import Button from "./Button";
import { RightArrow, LeftArrow } from "@/assets/common/icons";

export default function DataTable({
  records,
  columns,
  totalRecords,
  recordsPerPage,
  page,
  onPageChange,
  recordsPerPageOptions,
  onRecordsPerPageChange,
  minHeight = 200,
  paginationText = ({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`,
  className = '',
}: ITableProps) {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const from = (page - 1) * recordsPerPage + 1;
  const to = Math.min(page * recordsPerPage, totalRecords);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="min-w-full divide-y divide-gray-200">
              {/* Table */}
              <div className="overflow-auto bg-white" style={{ minHeight: `${minHeight}px` }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.length > 0 ? (
                      records.map((record, recordIndex) => (
                        <tr key={recordIndex}>
                          {columns.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                            >
                              {column.render
                                ? column.render(record)
                                : column.accessor
                                  ? record[column.accessor]
                                  : record[column.title.toLowerCase()]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                {/* Mobile pagination */}
                <div className="flex-1 flex justify-between items-center sm:hidden">
                  <Button
                    text="Previous"
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  />
                  <span className="text-sm text-gray-700">
                    {paginationText({ from, to, totalRecords })}
                  </span>
                  <Button
                    text="Next"
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  />
                </div>

                {/* Desktop pagination */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {paginationText({ from, to, totalRecords })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <label htmlFor="records-per-page" className="mr-2 text-sm text-gray-700">
                        Rows per page:
                      </label>
                      <select
                        id="records-per-page"
                        value={recordsPerPage}
                        onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md shadow-sm py-1 pl-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {recordsPerPageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <Button
                        onClick={handlePrevious}
                        disabled={page === 1}
                        icon={<LeftArrow />}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      />
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            text={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          />

                        );
                      })}
                      <Button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        icon={<RightArrow />}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      />
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}