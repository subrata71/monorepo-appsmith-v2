import { useEffect, useState } from 'react';
import { bstApi } from '@/entities/bst';

export const useBSTInitialization = () => {
  const [currentTreeId, setCurrentTreeId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTree = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        
        // Try to get existing trees
        const { trees } = await bstApi.getTrees();
        let treeId: string;
        
        if (trees.length > 0) {
          // Use the first existing tree
          treeId = trees[0].id;
        } else {
          // Create a new tree
          const { tree } = await bstApi.createTree('BST Visualizer Tree');
          treeId = tree.id;
        }
        
        setCurrentTreeId(treeId);
        
      } catch (error) {
        console.error('Failed to initialize BST tree:', error);
        setError('Failed to connect to server. Using client-side mode.');
        // Continue without backend - the app will work in client-only mode
      } finally {
        setIsInitializing(false);
      }
    };

    initializeTree();
  }, []);

  return {
    currentTreeId,
    isInitializing,
    error,
  };
};