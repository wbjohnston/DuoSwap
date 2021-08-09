import React from "react"
import { Layout, Button, Menu, Typography, Row, Col } from 'antd';
const { Header, Content, Footer } = Layout;
import { Component } from "react";
import Image from "next/image";
// @ts-ignore
import Logo from "../public/logo.svg"
import { useEthers, useEtherBalance } from "@usedapp/core";
import { BigNumber, ethers } from 'ethers'
import Icon from "@ant-design/icons/lib/components/Icon";

interface WalletConnectionButtonProps {
    activateWallet: any;
    deactivateWallet: any;
    account: string | null | undefined;
}

function WalletManagementMenu({ activateWallet, deactivateWallet: deactiveWallet, account }: WalletConnectionButtonProps) {
    const walletIsConnected = account !== undefined && account !== null;
    return walletIsConnected
        // connected
        ? <WalletManagementMenuWithWalletConnected account={account} deactivateWallet={deactiveWallet} />
        // disconnected
        : <WalletManagementMenuWithWalletDisconnected activateWallet={activateWallet} />
}

function WalletManagementMenuWithWalletConnected({ deactivateWallet, account }: Pick<WalletConnectionButtonProps, 'account' | 'deactivateWallet'>) {
    const etherBalance = useEtherBalance(account) as ethers.BigNumber;
    const formattedEthBalance = etherBalance ? ethers.utils.formatEther(etherBalance).slice(0, 5) : 0;
    return <Row justify="space-between">
        <Col>
            <Typography style={{ margin: '0 10px' }}>Balance: {formattedEthBalance} ETH</Typography>
        </Col>
        <Col>
            <Button type="primary" onClick={deactivateWallet}>
                Disconnect Wallet
            </Button>
        </Col>
    </Row>

}

function WalletManagementMenuWithWalletDisconnected({ activateWallet }: any) {
    return <Row justify="space-between">
        <Col>
            <Button type="primary" onClick={activateWallet} >Connect Wallet</Button>
        </Col>
    </Row>
}

function NoWalletConnectionScreen({ ...props }) {
    // return <div>Connect to your wallet to use Hotdog Swap</div>

    return <Row justify="space-around" align="middle">
        <Col>
            <Typography>Connect your wallet to hotdog swap to use the app</Typography>
        </Col>
    </Row>
}

export default function DuoSwapLayout({ children }: { children: Component | Component[] }) {
    const { activateBrowserWallet, deactivate, account } = useEthers();

    return <Layout className="layout">
        <Header style={{ backgroundColor: 'transparent' }}>
            <Row justify="space-between" align="middle">
                <Col>
                    {/* <Icon src={Logo} width={30} height={30} alt="logo"/> */}
                    <Typography>🌭 Hotdog Swap</Typography>
                </Col>
                <Col>
                    <WalletManagementMenu activateWallet={activateBrowserWallet} deactivateWallet={deactivate} account={account} />
                </Col>
            </Row>
        </Header>
        <Content style={{ padding: '50px' }}>
            {account
                ? <div className="site-layout-content">
                    {children}
                </div>
                : <NoWalletConnectionScreen />
            }
        </Content>
    </Layout>
}