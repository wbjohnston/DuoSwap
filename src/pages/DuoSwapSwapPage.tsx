import { useSendTransaction } from "@usedapp/core";
import { Card, Col, Row, Form, Input, Select, Button, } from "antd";
import React, { useState } from "react";


const CURRENCY_OPTIONS = [
    'ETH',
    'HTDG'
]

export default function DuoSwapSwapPage() {
    const [form] = Form.useForm();
    const { sendTransaction, state } = useSendTransaction();

    function onSwapFormSubmit(x: any) {
        sendTransaction({ to: '0x0000000000000000000000000000000000000000', })
            .then(onSwapTransactionCompletion)
            .catch(onSwapTransactionError)
    }

    function onSwapTransactionCompletion(e: any) {
        console.log(e)
    }

    function onSwapTransactionError(e: any) {
        console.log(e)
    }

    return <Row style={{ height: '100%', alignItems: 'center', display: 'flex' }} justify="center" align="middle">
        <Col>
            <Card title="Swap">
                <Form labelAlign="left" layout="vertical" form={form} onFinish={onSwapFormSubmit}>
                    <Form.Item label="From">
                        <Input.Group compact>
                            <Form.Item name="tokenFrom" rules={[{ required: true }]}>
                                <Select placeholder="ETH">
                                    {React.Children.map(CURRENCY_OPTIONS, (x) => <Select.Option value={x}>
                                        {x}
                                    </Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="tokenFromAmount" rules={[{ required: true }]}>
                                <Input placeholder="0.0" type="number" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="To">
                        <Input.Group compact>
                            <Form.Item name="tokenTo" rules={[{ required: true }]}>
                                <Select placeholder="ETH">
                                    {React.Children.map(CURRENCY_OPTIONS, (x) => <Select.Option value={x}>
                                        {x}
                                    </Select.Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="tokenToAmount" rules={[{ required: true }]}>
                                <Input placeholder="0.0" type="number" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item label="" colon={false}>
                        <Button style={{ width: '100%' }} type="primary" htmlType="submit">Swap!</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </Row>
    return <div>There will be a box here</div>
}