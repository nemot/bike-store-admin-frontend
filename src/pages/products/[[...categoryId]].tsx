import { useRouter } from 'next/router';
import { Product, useProducts } from '@/providers/ProductsProvider';
import { Table, Button, Typography, Image } from 'antd';
import { PlusOutlined } from "@ant-design/icons"
import { useCategories } from "@/providers/CategroiesProvider"
import { useEffect, useState, useRef } from 'react';
import ProductModal from "@/pages/products/ProductModal";

const { Title } = Typography;
 
export default function ProductsPage() {
  const router = useRouter()
  const [cid, setCid] = useState<string | undefined>('')
  const modalRef = useRef<{ openModal: (product: Product) => void }>(null);
  const { categories, updateCategory, currentCategory, selectCategory } = useCategories();
  const { products, productsLoading } = useProducts();

  const editCategory = () => {
    if(!currentCategory) { return }
    const newTag = prompt('Rename category', currentCategory.tag)
    updateCategory(currentCategory.id, newTag);
  }

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
    console.log('Rendering page: Category is: ', categoryId)
    selectCategory(categoryId as number)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, cid, products])

  return (
    <div className='bg-white rounded-md p-4'>
      <div className='flex pb-4'>
        <div className='grow flex'>
          <Title level={3} className='cursor-pointer' onClick={editCategory}>{currentCategory?.tag}</Title>
        </div>
        <div className=''>
          <Button variant='solid' icon={<PlusOutlined />}>Add product</Button>
        </div>
      </div>
      
      <Table<Product>
        size="middle"
        loading={productsLoading}
        columns={[
          { title: '', dataIndex: 'image_thumb_url', key: 'thumb', render: (path) => (
            path ? <Image alt='' height={30} width={30} src={`${process.env.API_HOST}${path}`} className='h-10' /> : <></>
          )},
          { title: 'Name', dataIndex: 'name', key: 'name'},
          { title: 'Price', dataIndex: 'price', key: 'price' },
        ]}
        dataSource={products as Product[]}
        onRow={(record) => ({
          onClick: () => { modalRef.current?.openModal(record) }
        })}
        className='cursor-pointer'
        />

      <ProductModal ref={modalRef} />
      
    </div>
  )
}