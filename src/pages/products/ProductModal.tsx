import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import { Modal, Button, Input, Upload, message, Select } from 'antd';
import { Product, useProducts } from '@/providers/ProductsProvider';
import { useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import type { UploadProps, SelectProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { useCategories } from "@/providers/CategroiesProvider"
import Image from "next/image";

const { TextArea } = Input;

type ProductModalState = {
  product: Product | null;
  modalIsOpen: boolean;
  saveInProgress: boolean;
  uploadInProgress: boolean;
}

const ProductModal = forwardRef((props, ref) => {
  const [state, setState] = useState<ProductModalState>({
    product: null,
    modalIsOpen: false,
    saveInProgress: false,
    uploadInProgress: false,
  } as ProductModalState)

  const { product } = state;
  
  const imageUploadUrl = `${process.env.API_HOST}/admin/products/${product?.id}/upload_image`
  const { fetchProducts, updateProduct } = useProducts();
  const [messageApi, contextHolder] = message.useMessage();
  const { categories, tags } = useCategories();

  const categoriesSelectOptions: SelectProps['options'] = categories ? (
    tags(categories).map( tag => ({value: tag.id.toString(), label: tag.name}))
  ) : [];

  useImperativeHandle(ref, () => ({ openModal }));
  const openModal = (newProduct: Product) => {
    console.log(newProduct)
    setState({...state, product: newProduct, modalIsOpen: true})
  }

  const saveProduct = () => {
    if(!product) { return }

    setState({...state, saveInProgress: true})
    updateProduct(product)
      .catch(e => console.error('Error updating product:', e))
      .then(() => {
        fetchProducts()
        setState({...state, modalIsOpen: false, saveInProgress: false})
      })
    
  }

  const handleCategoriesFieldChange = (tagIds: string[]) => {
    if (!categories || !product) { return }

    const ids = tagIds.map(i => parseInt(i))
    const categoryTags = tags(categories).filter((cat) => ids.includes(cat.id))
    setState({...state, product: {...product, category_tags: categoryTags} as Product})
  }

  const handleUploadStatusChange: UploadProps['onChange'] = ({file}: UploadChangeParam) => {
    switch(file.status) {
      case 'done': {
        fetchProducts()
        setState({...state, uploadInProgress: false})
        break;
      }
      case 'uploading': {
        setState({...state, uploadInProgress: true})
        break;
      }
      case 'error': {
        messageApi.open({ type: 'error', content: 'Upload has failed'});
        setState({...state, uploadInProgress: false})
        break;
      }
      default: {
        setState({...state, uploadInProgress: false})
      }
    }
  }

  useEffect(() => {
    console.log('Rendering: ', state)
  }, [state.product, categories])

  if (!product) { return (<></>) }
  
  return (
    <Modal title="The product"
        open={state.modalIsOpen}
        onOk={saveProduct}
        onCancel={() => { setState({...state, modalIsOpen: false}) }}
        footer={[
          <Button key="link" type="primary" loading={state.saveInProgress} onClick={saveProduct}>Save Product</Button>
        ]}
        >
      {contextHolder}
      <div className='flex gap-4'>
        <div className='grow'>
          <div className='flex flex-col gap-2'>
            <Input
              placeholder="Product name"
              value={product.name}
              onChange={e => setState({...state, product: {...product, name: e.target.value} as Product}) }
              />
            <TextArea
              placeholder="Product description"
              autoSize={{ minRows: 5, maxRows: 10 }}
              value={product.description ?? ''}
              onChange={e => setState({...state, product: {...product, description: e.target.value} as Product}) }
              />
          </div>
        </div>

        <div className='w-36'>
          <div className='flex flex-col gap-2'>
            <Input
              prefix="$"
              placeholder="0.00"
              value={product.price ?? '0.00'}
              onChange={e => setState({...state, product: {...product, price: parseFloat(e.target.value)} as Product}) }
              />
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action={imageUploadUrl}
              beforeUpload={() => { setState({...state, uploadInProgress: true}) }}
              onChange={ handleUploadStatusChange }
            >
              {product.image_thumb_url ? (
                <Image src={`${process.env.API_HOST}${product?.image_thumb_url}`} alt='' width={60} height={60} />
              ) : (
                <button className='border-0 bg-none flex flex-col gap-2 items-center'>
                  {state.uploadInProgress ? <LoadingOutlined /> : <PictureOutlined className='text-3xl' />}
                  Upload
                </button>
              )}
            </Upload>
          </div>
        </div>
      </div>

      <div className='py-4'>
        <Select
            mode="multiple"
            allowClear
            className="w-full"
            placeholder="Select category"
            value={product.category_tags.map(tag => tag.id.toString())}
            options={categoriesSelectOptions}
            onChange={handleCategoriesFieldChange}
          />
        </div>
    </Modal>
  )
})

ProductModal.displayName = 'ProductModal'
export default ProductModal;