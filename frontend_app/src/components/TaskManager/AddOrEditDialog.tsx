import React, { useEffect } from 'react';
import { Input, Form, Select } from 'antd';
import { CustomTask } from './types';
import Dialog from '../common/Dialog';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  task?: CustomTask;
  statuses?: string[];
  onSave: (task: CustomTask) => void;
  onCancel: () => void;
}

const AddOrEditDialog: React.FC<Props> = ({ open, task, statuses, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const { setFieldsValue, validateFields } = form;

  useEffect(() => {
    if (!open) return; 

    if (task) {
      setFieldsValue(task);
    } else {
      form.resetFields();
    }    
  }, [open, task, form, setFieldsValue]);

  const handleSave = () => {
    validateFields().then(values => onSave({ ...task, ...values }));
  };

  /**
   * SHOW STATUS DROPDOWN ONLY WHEN:
   * 1. Editing (task is defined)
   * 2. Statuses are fully loaded (array and not empty)
   */
  const showStatusField = task && Array.isArray(statuses) && statuses.length > 0;

  return (
    <Dialog
      open={open}
      title={task ? 'Edit Task' : 'Add Task'}
      submitLabel={task ? 'Save' : 'Add'}
      onSubmit={handleSave}
      onCancel={onCancel}
    >
      <Form data-testid="AddOrEditForm" form={form} layout="vertical">
        <Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input data-testid="input-title" placeholder="Enter task title" />
        </Item>
        <Item name="description" label="Description">
          <TextArea data-testid="input-description" rows={3} placeholder="Enter task description" />
        </Item>

        {showStatusField && (
          <Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select data-testid="input-status" placeholder="Select task status">
              {statuses?.map(status => (
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
