import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form } from "antd";
import { CustomTask } from "./useTasks";

type Props = {
    visible: boolean;
    task?: CustomTask;
    onSave: (task: CustomTask) => void;
    onCancel: () => void;
};

const AddOrEditDialog = ({ visible, task, onSave, onCancel }: Props) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (task) {
            form.setFieldsValue(task);
        } else {
            form.resetFields();
        }
    }, [task, form]);

    const handleSave = () => {
        form.validateFields().then((values) => {
            onSave({ ...task, ...values });
        });
    };

    return (
        <Modal
            title={task ? "Edit Task" : "Add Task"}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    {task ? "Update Task" : "Add Task"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
                    <Input placeholder="Enter task title" />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} placeholder="Enter task description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddOrEditDialog;
