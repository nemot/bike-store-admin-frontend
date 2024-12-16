import React from 'react';
import { Layout } from 'antd';
import LeftMenu from "@/components/LeftMenu"

const { Content, Sider } = Layout;


interface LayoutProps {
  children: React.ReactNode;
}

const ApplicationLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' width={300}><LeftMenu /></Sider>
      <Content className='p-4'>{children}</Content>
    </Layout>
  );
};

export default ApplicationLayout;