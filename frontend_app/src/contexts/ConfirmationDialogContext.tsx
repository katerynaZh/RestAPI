// Import React and required hooks: useState (for state), createContext (to create context),
// useContext (to access context in any component)
import React, { useState, createContext, useContext } from 'react';

// Import the confirmation dialog component
import Dialog from '../components/common/Dialog';

// Types for props passed to the confirmation dialog
type DialogProps = {
  title: string; // Dialog title
  text: string; // Main message text
  confirmLabel?: string; // Text for the confirm button (optional)
  onConfirm: () => void; // Function called when confirm button is clicked
  onCancel: () => void; // Function called when cancel button is clicked
};

// Type for the dialog context
type ConfirmationDialogContextType = {
  openConfirmation: (props: DialogProps) => void; // Function to open the dialog
  closeConfirmation: () => void; // Function to close the dialog
};

// Create the context that will be used to provide open/close dialog functions
export const ConfirmationDialogContext =
  createContext<ConfirmationDialogContextType>(
    {} as ConfirmationDialogContextType // Type assertion to avoid TypeScript errors
  );

// Provider that wraps child components and provides dialog functionality
export const ConfirmationDialogProvider = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to track if the dialog is open
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null); // Current dialog parameters

  // Opens the dialog with the given parameters
  const openConfirmation = ({
    title,
    text,
    confirmLabel,
    onConfirm,
    onCancel,
  }: DialogProps) => {
    setDialogProps({ title, text, confirmLabel, onConfirm, onCancel });
    setIsDialogOpen(true);
  };

  // Closes the dialog
  const closeConfirmation = () => {
    setIsDialogOpen(false);
    setDialogProps(null);
  };

  // Context value that will be available to children
  const value: ConfirmationDialogContextType = {
    openConfirmation,
    closeConfirmation,
  };

  // Return JSX
  return (
    <>
      {/* Provide context to child components */}
      <ConfirmationDialogContext.Provider value={value}>
        {children}
      </ConfirmationDialogContext.Provider>

      {/* Render the Dialog component if it's open and has props */}
      {isDialogOpen && dialogProps ? (
        <Dialog
          open={isDialogOpen}
          title={dialogProps.title}
          submitLabel={dialogProps.confirmLabel ?? 'Confirm'} // Use "Confirm" if confirmLabel is not provided
          onSubmit={dialogProps.onConfirm}
          onCancel={dialogProps.onCancel}
        >
          <p>{dialogProps.text}</p>
        </Dialog>
      ) : null}
    </>
  );
};

// Hook to use the confirmation dialog in any component directly
export const useConfirmationDialog = () => {
  return useContext(ConfirmationDialogContext);
};
