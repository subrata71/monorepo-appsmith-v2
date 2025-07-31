import { Button } from '@/shared/ui';
import { useBSTStore, BSTAlgorithms } from '@/entities/bst';
import { OperationControl } from './OperationControl';
import { StatusMessage } from './StatusMessage';

export const BSTControlsPanel = () => {
  const insertNode = useBSTStore(state => state.insertNode);
  const deleteNode = useBSTStore(state => state.deleteNode);
  const searchNode = useBSTStore(state => state.searchNode);
  const resetTree = useBSTStore(state => state.resetTree);
  const setStatusMessage = useBSTStore(state => state.setStatusMessage);
  const statusMessage = useBSTStore(state => state.statusMessage);
  const statusType = useBSTStore(state => state.statusType);
  const animationState = useBSTStore(state => state.animationState);

  const handleInsert = (value: string) => {
    const validation = BSTAlgorithms.validateValue(value);
    if (!validation.isValid) {
      setStatusMessage(validation.error!, 'error');
      return;
    }
    insertNode(validation.numValue!);
  };

  const handleDelete = (value: string) => {
    const validation = BSTAlgorithms.validateValue(value);
    if (!validation.isValid) {
      setStatusMessage(validation.error!, 'error');
      return;
    }
    deleteNode(validation.numValue!);
  };

  const handleSearch = (value: string) => {
    const validation = BSTAlgorithms.validateValue(value);
    if (!validation.isValid) {
      setStatusMessage(validation.error!, 'error');
      return;
    }
    searchNode(validation.numValue!);
  };

  const isOperationDisabled = animationState.isAnimating;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Tree Operations</h2>
        <p className="text-xs sm:text-sm text-gray-600">Enter integers between -999 and 999</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <OperationControl
          label="Insert Node"
          placeholder="Enter number to insert"
          buttonText="Insert"
          onSubmit={handleInsert}
          disabled={isOperationDisabled}
        />

        <OperationControl
          label="Delete Node"
          placeholder="Enter number to delete"
          buttonText="Delete"
          onSubmit={handleDelete}
          disabled={isOperationDisabled}
          variant="destructive"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <OperationControl
          label="Search Node"
          placeholder="Enter number to search"
          buttonText="Search"
          onSubmit={handleSearch}
          disabled={isOperationDisabled}
          variant="outline"
        />

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Reset Tree</label>
          <Button
            onClick={resetTree}
            disabled={isOperationDisabled}
            variant="secondary"
            className="w-full"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Status Message */}
      <StatusMessage message={statusMessage} type={statusType} />
    </div>
  );
};