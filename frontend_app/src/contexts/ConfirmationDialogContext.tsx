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
  openConfirmation: (props: DialogProps) => void;
  closeConfirmation: () => void;
}

export const ConfirmationDialogContext = createContext<ConfirmationDialogContextType>({} as ConfirmationDialogContextType);

export const ConfirmationDialogProvider = ({children}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

  const openConfirmation = ({ title, text, confirmLabel, onConfirm, onCancel }: DialogProps) => {
    setDialogProps({ title, text, confirmLabel, onConfirm, onCancel });
    setIsDialogOpen(true);
  };

  const closeConfirmation = () => {
    setIsDialogOpen(false);
    setDialogProps(null);
  };

  const value: ConfirmationDialogContextType = {openConfirmation, closeConfirmation};

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
