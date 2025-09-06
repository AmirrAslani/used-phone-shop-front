import DataTable from "@/lib/components/base/DataTable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllPhones } from "@/services/single/singleService";
import { IProducts } from "@/interface/shop.interface";

const PAGE_SIZES = [10, 20, 30, 50];

export default function ProductsTable() {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  useEffect(() => {
    getAllPhones()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
      })
  }, []);

  return (
    <DataTable
    className="max-w-7xl m-auto py-8"
      minHeight={400}
      records={products}
      columns={[
        {
          title: "تصویر",
          render: (product) => (
            <img
              src={product.image}
              alt={product.model}
              className="w-16 h-16 object-cover rounded-md border border-gray-200"
            />
          ),
          className: "w-24",
        },
        {
          title: "برند",
          accessor: "brand",
          className: "font-medium text-gray-900",
        },
        {
          title: "مدل",
          accessor: "model",
          render: (product) => (
            <div className="max-w-xs truncate">{product.model}</div>
          ),
        },
        {
          title: "توضیحات",
          accessor: "description",
          render: (product) => (
            <div className="text-sm text-gray-600 truncate">
              {product.description}
            </div>
          ),
        },
        {
          title: "عملیات",
          render: (product) => (
            <Link
              href={`/shop/admin/phones/edit/${product.id}`}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              ویرایش
            </Link>
          ),
          className: "text-center w-28",
        },
      ]}
      totalRecords={products.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={setPage}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      paginationText={({ from, to, totalRecords }) =>
        `نمایش ${from} تا ${to} از ${totalRecords} محصول`
      }
    />
  );
}
