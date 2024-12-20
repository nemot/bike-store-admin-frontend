'use client';

import { AppstoreOutlined, ToolOutlined, UserOutlined, ShopOutlined, LoadingOutlined } from '@ant-design/icons';
import { Menu, MenuProps, Space, Tree, TreeProps, TreeDataNode, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Category, useCategories } from "@/providers/CategroiesProvider"
import Link from 'next/link'


type MenuItem = Required<MenuProps>['items'][number];

export default function LeftMenu() {
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>(['orders']);
  const { categories, categoriesLoading, currentCategory, selectCategory } = useCategories();
  const [categoriesTreeData, setCategoriesTreeData] = useState<TreeDataNode[]>([]);
  const [categoriesTreeSelectedKeys, setCategoriesTreeSelectedKeys] = useState<number[]>([]);

  function convertToTreeData(categories: Category[] | null, emptyCounter: number): TreeDataNode[] {
    if (!categories) { return [] };
    if(!currentCategory) { setCategoriesTreeSelectedKeys([]) }
    
    return categories.map((category) => {
      if(currentCategory && category.id && currentCategory.id === category.id) {
        setCategoriesTreeSelectedKeys([category.id])
      }
      return {
        key: category.id ? category.id : emptyCounter--,
        title: (category.id ? <Link href={`/products/${category.id}`} > {category.name}</Link > : category.name),
        children: convertToTreeData(category.children, emptyCounter),
      }
    });
  };


  const handleCategorySelect: TreeProps['onSelect'] = (selectedKeys: React.Key[]) => {
    if (selectedKeys[0] as number <= 0) { return }
    
    selectCategory(selectedKeys[0] as number)
    setSelectedMenuItems([]);
  };

  const handleSelectMenuItem = ({ key }: { key: string }) => {
    selectCategory(null)
    setSelectedMenuItems([key])
  }

  const items: MenuItem[] = [
    { type: 'divider' },
    { key: 'orders', icon: <ShopOutlined />, label: 'Orders' },
    { key: 'rules', icon: <ToolOutlined />, label: 'Custom bicycle rules' },
    { key: 'users', icon: <UserOutlined />, label: 'Administrators' },
    { type: 'divider' },
    { key: 'products', icon: <AppstoreOutlined />, label: (<Link href="/products/">All products</Link>) },
  ];

  useEffect(() => {
    setCategoriesTreeData(convertToTreeData(categories,0))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, currentCategory]);

  return (
    <div>
      <div className='font-semibold text-xl py-2 pl-6'>BicycleAdmin</div>
      <Menu
        mode="inline"
        className='w-full'
        selectedKeys={selectedMenuItems}
        items={items}
        onSelect={handleSelectMenuItem} />
      {categoriesLoading ? (
        <Space className='pl-6 pt-4'><Spin indicator={<LoadingOutlined spin />} />Loading categories..</Space>
      ) : (
        <Tree
          className='pl-6'
          defaultExpandAll
          showLine={true}
          treeData={categoriesTreeData}
          selectedKeys={categoriesTreeSelectedKeys}
          onSelect={handleCategorySelect} />
      )}

    </div>
  )
}