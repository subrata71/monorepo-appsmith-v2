import { Helmet } from 'react-helmet';
import { Container } from '@/shared/ui';
import { TreeControls } from '@/features/tree-controls';
import { TraversalControls } from '@/features/tree-traversal';
import { TreeCanvas } from '@/features/tree-canvas';

export const TreeVisualizerPage = () => {
  return (
    <>
      <Helmet>
        <title>Binary Tree Visualizer</title>
      </Helmet>

      <Container className="py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Binary Tree Visualizer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive tool for creating, editing, and visualizing binary trees 
              with animated rendering and traversal stepping.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1 space-y-6">
              <TreeControls />
              <TraversalControls />
            </div>

            {/* Main Canvas Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tree Visualization
                  </h2>
                  <div className="text-sm text-gray-500">
                    Click nodes to select • Hover for details
                  </div>
                </div>
                
                <div className="relative">
                  <TreeCanvas width={800} height={600} />
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              How to Use
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">1. Build Your Tree</h4>
                <p>Enter integer values and click "Add Node" to build your binary search tree. Each value will be automatically positioned according to BST rules.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Explore Traversals</h4>
                <p>Select a traversal type (inorder, preorder, postorder) and step through to see how different algorithms visit the nodes.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Interactive Features</h4>
                <p>Click nodes to select them, hover for tooltips, and use the controls to modify your tree structure in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};