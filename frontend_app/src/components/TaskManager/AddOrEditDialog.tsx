import React, { useEffect } from 'react';
import { Input, Form } from 'antd';
import { CustomTask } from './useTasks';
import Dialog from '../common/Dialog';

const { Item } = Form;
const { TextArea } = Input;

type Props = {
  open: boolean;
  task?: CustomTask;
  onSave: (task: CustomTask) => void;
  onCancel: () => void;
};

const AddOrEditDialog = ({ open, task, onSave, onCancel }: Props) => {
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
    <Dialog
      open={open}
      title={task ? 'Edit Task' : 'Add Task'}
      submitLabel={task ? 'Save' : 'Add'}
      onSubmit={handleSave}
      onCancel={onCancel}
      >
        <Form form={form} layout="vertical">
          <Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Enter task title" />
          </Item>
          <Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter task description" />
          </Item>
        </Form>      
    </Dialog>
  );
};

export default AddOrEditDialog;
