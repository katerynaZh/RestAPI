import { TaskManager } from './components';
import { ConfirmationDialogProvider } from './contexts';

function App() {
  return <ConfirmationDialogProvider>
    <TaskManager />
  </ConfirmationDialogProvider>;
}

export default App;
