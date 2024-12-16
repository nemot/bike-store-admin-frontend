import { useRouter } from 'next/router';
import { Product, useProducts } from '@/providers/ProductsProvider';
import { Table, Breadcrumb } from 'antd';
import { currentCategory, useCategories } from "@/providers/CategroiesProvider"
import type { TableProps } from 'antd';
import { useEffect, useState } from 'react';
 
export default function ProductsPage() {
  const router = useRouter()
  const [cid, setCid] = useState<string | undefined>('')
  const { categories, categoriesLoading, currentCategory, selectCategory } = useCategories();

  const { products, productsLoading } = useProducts();

  useEffect(() => {
    if (router.isReady) {
      const categoryId = router.query.categoryId;
      if (typeof categoryId === "string") {
        setCid(categoryId);
      } else if (Array.isArray(categoryId)) {
        setCid(categoryId[0]); 
      }
    }
  }, [router.isReady, router.query.categoryId]);

  useEffect(() => {
    const categoryId = Array.isArray(cid) ? parseInt(cid[0], 10) : (cid ? parseInt(cid, 10) : undefined);
    selectCategory(categoryId as number)
  }, [cid])


  const columns: TableProps<Product>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <div className='bg-white rounded-md p-4'>
      <Breadcrumb items={[
        {title: 'Products'},
      ]}/>
      <Table<Product>
        size="middle"
        loading={productsLoading}
        columns={columns}
        dataSource={products as Product[]}
        />
    </div>
  )
}