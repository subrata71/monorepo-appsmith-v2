import type { BSTNode, SearchResult } from './types';

export class BSTAlgorithms {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private static createNode(value: number): BSTNode {
    const now = new Date();
    return {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  static insert(root: BSTNode | null, value: number): BSTNode {
    if (root === null) {
      return this.createNode(value);
    }

    if (value < root.value) {
      root.left = this.insert(root.left, value);
    } else if (value > root.value) {
      root.right = this.insert(root.right, value);
    }
    // If value equals root.value, we don't insert (no duplicates)

    root.updatedAt = new Date();
    return root;
  }

  static delete(root: BSTNode | null, value: number): BSTNode | null {
    if (root === null) {
      return null;
    }

    if (value < root.value) {
      root.left = this.delete(root.left, value);
    } else if (value > root.value) {
      root.right = this.delete(root.right, value);
    } else {
      // Node to be deleted found
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      // Node with two children: Get the inorder successor
      const minRight = this.findMin(root.right);
      root.value = minRight.value;
      root.id = minRight.id; // Keep the successor's id
      root.right = this.delete(root.right, minRight.value);
    }

    root.updatedAt = new Date();
    return root;
  }

  static search(root: BSTNode | null, value: number): SearchResult {
    const path: string[] = [];
    let current = root;
    let found = false;
    let targetNode: BSTNode | undefined;

    while (current !== null) {
      path.push(current.id);
      
      if (current.value === value) {
        found = true;
        targetNode = current;
        break;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return { found, path, targetNode };
  }

  private static findMin(node: BSTNode): BSTNode {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  static validateValue(value: string): { isValid: boolean; error?: string; numValue?: number } {
    if (value.trim() === '') {
      return { isValid: false, error: 'Please enter a number' };
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Please enter a valid integer' };
    }

    if (numValue < -999 || numValue > 999) {
      return { isValid: false, error: 'Number must be between -999 and 999' };
    }

    return { isValid: true, numValue };
  }

  static nodeExists(root: BSTNode | null, value: number): boolean {
    if (root === null) return false;
    if (root.value === value) return true;
    if (value < root.value) return this.nodeExists(root.left, value);
    return this.nodeExists(root.right, value);
  }

  static getNodeCount(root: BSTNode | null): number {
    if (root === null) return 0;
    return 1 + this.getNodeCount(root.left) + this.getNodeCount(root.right);
  }

  static getTreeHeight(root: BSTNode | null): number {
    if (root === null) return 0;
    return 1 + Math.max(this.getTreeHeight(root.left), this.getTreeHeight(root.right));
  }
}