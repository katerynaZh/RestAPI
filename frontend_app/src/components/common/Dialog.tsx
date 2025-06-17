import React from 'react';
import { Modal, Button } from 'antd';

type Props = {
  title: string;
  open: boolean;
  submitLabel: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
};

const Dialog = ({
  title,
  open,
  children,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) => {
  return (
    <Modal
      data-testid="dialog"
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button data-testid="dialog-cancelBtn" key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          data-testid="dialog-confirmBtn"
          type="primary"
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default Dialog;
