import { useState, useEffect } from 'react';
import * as _ from 'lodash';

interface TreeNode {
  key: string;
  children?: TreeNode[];
}

interface ListNode {
  key: string;
  children?: string[];
  level: number;
}

interface UseTree {
  expandedKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
  dataSource: ListNode[];
}

function getDataSource<T extends TreeNode>(treeData: T[], expandedRowKeys: string[]): ListNode[] {
  const rows: ListNode[] = [];

  const walk = (nodes: TreeNode[], level = 0) => {
    nodes.forEach((node: TreeNode) => {
      const { children } = node;
      rows.push({
        ..._.omit(node, ['children']),
        level,
        children: children && children.map(c => c.key),
      });

      if (children && expandedRowKeys.includes(node.key)) {
        walk(children, level + 1);
      }
    });
  };

  if (treeData != null) {
    walk(treeData);
  }

  return rows;
}

function useTree<T extends TreeNode>(treeData: T[], defaultExpandedKeys: string[] = []): UseTree {
  const [expandedKeys, setExpandedKeys] = useState<string []>(defaultExpandedKeys);
  const [dataSource, setDataSource] = useState(getDataSource(treeData, expandedKeys));

  useEffect(() => {
    setDataSource(getDataSource(treeData, expandedKeys));
  }, [treeData, expandedKeys]);

  return {
    dataSource,
    expandedKeys,
    setExpandedKeys,
  };
}

export default useTree;
