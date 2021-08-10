import { Card, Col, Row, Form, Input, Select, Button, Divider, Typography } from "antd";
import Modal, { ModalProps } from "antd/lib/modal/Modal";
import { ContractTransaction } from "ethers";
import React from "react";
import { ReactElement } from "react";
import { useState } from "react";
import useDuoSwapFactoryContract from "../hooks/useDuoSwapPoolFactoryContract";

const TOKEN_FROM_AMOUNT_INPUT_NAME = 'tokenFromAmount'
const TOKEN_FROM_INPUT_NAME = 'tokenFrom'
const TOKEN_TO_INPUT_NAME = 'tokenTo'

const CURRENCY_OPTIONS = {
    'LEX': '0xcd559cd325089fcfee48c74a3ab354127826cafa',
    'WILL': '0xccb41aafff72147e7063f98d4169f2385f27a499',
}

export default function DuoSwapSwapPage(): ReactElement {
    const [poolCreateModalIsVisible, setpoolCreateFormIsVisible] = useState(false);
    const [swapForm] = Form.useForm();
    const duoSwapPoolFactoryContract = useDuoSwapFactoryContract();

    function handleEitherSelectChange() {
        const tokenFrom = swapForm.getFieldValue(TOKEN_FROM_INPUT_NAME)
        const tokenFromAmount = swapForm.getFieldValue(TOKEN_FROM_AMOUNT_INPUT_NAME)
        const tokenTo = swapForm.getFieldValue(TOKEN_TO_INPUT_NAME)

        if (tokenFrom === undefined || tokenFromAmount == undefined || tokenTo == undefined) {
            return
        }

        duoSwapPoolFactoryContract.pools(tokenFrom, tokenTo).then(onPoolQuerySuccess)
    }

    function onPoolQuerySuccess(poolAddress: string) {
        if (poolAddress === '0x0000000000000000000000000000000000000000') {
            console.log('DuoSwap: NO POOL FOUND')
            setpoolCreateFormIsVisible(false)
            return
        }

        onPoolFindSuccess()
    }

    function onPoolFindSuccess() {
        setpoolCreateFormIsVisible(true);
    }

    return <>
        <Row style={{ height: '100%', alignItems: 'center', display: 'flex' }} justify="center" align="middle">
            <Col>
                <Card title="Swap">
                    <Form labelAlign="left" layout="vertical" form={swapForm}>
                        <Form.Item label="From">
                            <Input.Group compact>
                                <Form.Item name={TOKEN_FROM_INPUT_NAME} rules={[{ required: true }]}>
                                    <Select onChange={handleEitherSelectChange} placeholder="ETH">
                                        {Object.entries(CURRENCY_OPTIONS).map(([name, address]) => <Select.Option key={`${TOKEN_FROM_INPUT_NAME}_${name}`} value={address}>
                                            {name}
                                        </Select.Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item name={TOKEN_FROM_AMOUNT_INPUT_NAME} rules={[{ required: true }]}>
                                    <Input placeholder="0.0" type="number" />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item label="To">
                            <Form.Item name={TOKEN_TO_INPUT_NAME} rules={[{ required: true }]}>
                                <Select onChange={handleEitherSelectChange} placeholder="ETH">
                                    {Object.entries(CURRENCY_OPTIONS).map(([name, address]) => <Select.Option key={`${TOKEN_TO_INPUT_NAME}_${name}`} value={address}>
                                        {name}
                                    </Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="" colon={false}>
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">Swap!</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row >
        <PoolCreationModal
            onCancel={() => setpoolCreateFormIsVisible(false)}
            visible={poolCreateModalIsVisible}
            tokenA={swapForm.getFieldValue(TOKEN_FROM_INPUT_NAME)}
            tokenB={swapForm.getFieldValue(TOKEN_TO_INPUT_NAME)}
        />
    </>
}

function PoolCreationModal({ visible, tokenA, tokenB, ...props }: { visible: boolean, tokenA: string, tokenB: string } & Pick<ModalProps, 'onCancel'>) {
    const duoSwapPoolFactoryContract = useDuoSwapFactoryContract();

    function onPoolCreateFormFinish() {
        duoSwapPoolFactoryContract.functions.createPool(tokenA, tokenB)
            .then(onPoolCreateSuccess)
            .catch(onPoolCreateFailure)
    }

    function onPoolCreateSuccess(x: ContractTransaction) {
        console.log(x)

    }

    function onPoolCreateFailure(e: Error) {
        console.error(e)
    }

    const [poolCreateForm] = Form.useForm();
    return <Modal {...props} title="Create Pool" visible={visible} onOk={() => poolCreateForm.submit()} >
        <Typography>
            The selected pool does not exist
        </Typography>
        <Divider />
        <Form layout="vertical" form={poolCreateForm} onFinish={onPoolCreateFormFinish}>
            <Form.Item label={tokenA} name="tokenAAmount" rules={[{ required: true }]}>
                <Input placeholder="0.0" type="number" />
            </Form.Item>
            <Form.Item label={tokenB} name="tokenBAmount" rules={[{ required: true }]}>
                <Input placeholder="0.0" type="number" />
            </Form.Item>
        </Form>
    </Modal>

}