import { Helmet } from 'react-helmet';
import { BSTSVGTree } from '@/widgets/bst-visualization';
import { BSTControlsPanel } from '@/features/bst-operations';

export const BSTVisualizerPage = () => {
  return (
    <>
      <Helmet>
        <title>BST Visualizer | Minimalist BST Visualizer</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Binary Search Tree Visualizer
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Interactive visualization of BST operations with real-time animations
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="space-y-6 sm:space-y-8">
            {/* Controls Panel */}
            <div className="order-2 lg:order-1">
              <BSTControlsPanel />
            </div>

            {/* Tree Visualization */}
            <div className="order-1 lg:order-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Tree Visualization</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Watch your binary search tree operations come to life
                </p>
              </div>
              
              <div className="w-full overflow-hidden" style={{ minHeight: '300px' }}>
                <BSTSVGTree />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium mb-2">📥 Insert</h4>
                  <p>Add a new node to the tree. The node will be placed according to BST rules.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🗑️ Delete</h4>
                  <p>Remove a node from the tree. The tree will automatically reorganize.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔍 Search</h4>
                  <p>Find a node in the tree. The search path will be highlighted in real-time.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔄 Reset</h4>
                  <p>Clear the entire tree and start fresh with an empty tree.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};