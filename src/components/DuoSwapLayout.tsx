import React from "react"
import { Layout, Button, Typography, Row, Col } from 'antd';
const { Header, Content } = Layout;
import { Component } from "react";
import { useEthers, useEtherBalance, Web3Ethers } from "@usedapp/core";
import { ethers } from 'ethers'
import { ReactElement } from "react";

interface WalletConnectionButtonProps {
    activateWallet: Web3Ethers['activateBrowserWallet'];
    deactivateWallet: Web3Ethers['deactivate'];
    account: Web3Ethers['account'];
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

function WalletManagementMenuWithWalletDisconnected({ activateWallet }: { activateWallet: Web3Ethers['activateBrowserWallet'] }) {
    return <Row justify="space-between">
        <Col>
            <Button type="primary" onClick={() => activateWallet()} >Connect Wallet</Button>
        </Col>
    </Row>
}

function NoWalletConnectionScreen() {
    // return <div>Connect to your wallet to use Hotdog Swap</div>

    return <Row justify="space-around" align="middle">
        <Col>
            <Typography>Connect your wallet to hotdog swap to use the app</Typography>
        </Col>
    </Row>
}

export default function DuoSwapLayout({ children }: { children: Component | Component[] }): ReactElement {
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