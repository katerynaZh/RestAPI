import React, { useState, createContext, useContext } from 'react';
import Dialog from '../components/common/Dialog';

type DialogProps = {
  title: string;
  text: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ConfirmationDialogContextType = {
  open: (props: DialogProps) => void;
  close: () => void;
}

export const ConfirmationDialogContext = createContext<ConfirmationDialogContextType>({} as ConfirmationDialogContextType);

export const ConfirmationDialogProvider = ({children}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

  const open = ({ title, text, confirmLabel, onConfirm, onCancel }: DialogProps) => {
    setDialogProps({ title, text, confirmLabel, onConfirm, onCancel });
    setIsDialogOpen(true);
  };

  const close = () => {
    setIsDialogOpen(false);
    setDialogProps(null);
  };

  const value: ConfirmationDialogContextType = {open, close};

  return <>
    <ConfirmationDialogContext.Provider value={value}>
      {children}
    </ConfirmationDialogContext.Provider>
    {
      isDialogOpen && dialogProps ? (
          <Dialog
            open={isDialogOpen}
            title={dialogProps.title}
            submitLabel={dialogProps.confirmLabel ?? "Confirm"}
            onSubmit={dialogProps.onConfirm}
            onCancel={dialogProps.onCancel}
          >
            <p>{dialogProps.text}</p>
          </Dialog>
        ) : null
      }
  </>
}

export const useConfirmationDialog = ()=>{
  return useContext(ConfirmationDialogContext);
}
