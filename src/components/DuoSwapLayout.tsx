import { Layout, Button } from 'antd';
const { Header, Content, Footer } = Layout;
import { Component } from "react";
import Image from "next/image";
// @ts-ignore
import Logo from "../public/logo.svg"
import { useEthers, useEtherBalance } from "@usedapp/core";
import { BigNumber, ethers } from 'ethers'

export default function DuoSwapLayout({ children }: { children: Component | Component[] }) {

    const { activateBrowserWallet, deactivate, account } = useEthers();
    const etherBalance: BigNumber | undefined = useEtherBalance(account);

    function onActivateButtonClick() {
        activateBrowserWallet();
    }

    function onDisconnectButtonClick() {
        deactivate();
    }

    console.log(account, etherBalance);


    return <Layout className="layout">
        <Header>
            <Image src={Logo} width={100} height={50} alt="logo" />
            <span style={{ color: 'white', justifyContent: 'center' }}>Hotdog Swap</span>
            {
                account !== undefined && etherBalance !== undefined
                    ? (<Button type="primary" style={{ float: "right" }} onClick={onDisconnectButtonClick}>{ethers.utils.formatEther(etherBalance)} ETH</Button>)
                    : (<Button type="primary" style={{ float: "right" }} onClick={onActivateButtonClick}>Connect Wallet</Button>)
            }
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content">
                {children}
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>No Footer</Footer>
    </Layout>
}