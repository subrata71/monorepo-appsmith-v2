import type { BSTNode, NodePosition } from './types';

export class LayoutCalculator {
  private static readonly NODE_RADIUS = 25;
  private static readonly LEVEL_HEIGHT = 80;
  private static readonly MIN_HORIZONTAL_SPACING = 60;

  static calculateNodePositions(root: BSTNode | null, width: number): NodePosition[] {
    if (!root) return [];

    const positions: NodePosition[] = [];
    const maxWidth = Math.max(width, 800); // Minimum width for small screens
    
    this.calculatePositionsRecursive(
      root,
      maxWidth / 2, // Start at center
      50, // Top margin
      maxWidth / 4, // Initial horizontal spacing
      positions
    );

    return positions;
  }

  private static calculatePositionsRecursive(
    node: BSTNode,
    x: number,
    y: number,
    horizontalSpacing: number,
    positions: NodePosition[]
  ): void {
    // Add current node position
    positions.push({
      x,
      y,
      node,
    });

    // Calculate positions for children
    const nextY = y + this.LEVEL_HEIGHT;
    const nextSpacing = Math.max(horizontalSpacing / 2, this.MIN_HORIZONTAL_SPACING);

    if (node.left) {
      this.calculatePositionsRecursive(
        node.left,
        x - horizontalSpacing,
        nextY,
        nextSpacing,
        positions
      );
    }

    if (node.right) {
      this.calculatePositionsRecursive(
        node.right,
        x + horizontalSpacing,
        nextY,
        nextSpacing,
        positions
      );
    }
  }

  private static getTreeHeight(root: BSTNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(
      this.getTreeHeight(root.left),
      this.getTreeHeight(root.right)
    );
  }

  static calculateSVGDimensions(root: BSTNode | null, containerWidth: number): { width: number; height: number } {
    if (!root) {
      return { width: containerWidth, height: 200 };
    }

    const treeHeight = this.getTreeHeight(root);
    const height = Math.max(200, treeHeight * this.LEVEL_HEIGHT + 100);
    const width = Math.max(containerWidth, 800);

    return { width, height };
  }

  static getEdges(positions: NodePosition[]): Array<{ from: NodePosition; to: NodePosition }> {
    const edges: Array<{ from: NodePosition; to: NodePosition }> = [];
    const positionMap = new Map<string, NodePosition>();
    
    // Create a map for quick lookup
    positions.forEach(pos => {
      positionMap.set(pos.node.id, pos);
    });

    // Find edges between nodes
    positions.forEach(pos => {
      if (pos.node.left) {
        const leftChild = positionMap.get(pos.node.left.id);
        if (leftChild) {
          edges.push({ from: pos, to: leftChild });
        }
      }
      
      if (pos.node.right) {
        const rightChild = positionMap.get(pos.node.right.id);
        if (rightChild) {
          edges.push({ from: pos, to: rightChild });
        }
      }
    });

    return edges;
  }
}