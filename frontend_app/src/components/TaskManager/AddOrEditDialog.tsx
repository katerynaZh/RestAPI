import React, { useEffect, useState } from 'react';
import { Input, Form, Select } from 'antd'; // add Select
import { CustomTask } from './types';
import Dialog from '../common/Dialog';


const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

type Props = {
  open: boolean;
  task?: CustomTask;
  statuses?: string[];
  onSave: (task: CustomTask) => void;
  onCancel: () => void;

};

const AddOrEditDialog = ({ open, task, statuses, onSave, onCancel}: Props) => {
  const [form] = Form.useForm();
  const { setFieldsValue, validateFields } = form;

  useEffect(() => {
    if (open) {
      if (task) {
        form.setFieldsValue(task);
      } else {
        form.resetFields();
      }
    }
  }, [open, task, form]);

  const handleSave = () => {
    validateFields().then((values) => {
      onSave({ ...task, ...values });
    });
  };

  
  return (
    <Dialog
      open={open}
      title={task ? 'Edit Task' : 'Add Task'}
      submitLabel={task ? 'Save' : 'Add'}
      onSubmit={handleSave}
      onCancel={onCancel}
    >
      <Form form={form} data-testid="AddOrEditForm" layout="vertical">
        <Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input data-testid="input-title" placeholder="Enter task title" />
        </Item>
        <Item name="description" label="Description">
          <TextArea rows={3} data-testid="input-description" placeholder="Enter task description" />
        </Item>
        {task && ( // Only show status field if task is provided (for editing)
          <Item 
          
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select data-testid="input-status" placeholder="Select task status">
            {statuses?.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Item>
        )}
      </Form>
    </Dialog>
  );
};

export default AddOrEditDialog;
