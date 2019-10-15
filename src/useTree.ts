import * as _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';

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
  expandToLevel: (level: number) => void;
}

function useTree<T extends TreeNode>(treeData: T[], defaultExpandedKeys: string[] = []): UseTree {
  const [expandedKeys, setExpandedKeys] = useState<string []>(defaultExpandedKeys);

  const dataSource = useMemo<ListNode[]>(() => {
    const lns: ListNode[] = [];

    const walk = (nodes: TreeNode[], level = 0) => {
      nodes.forEach((node: TreeNode) => {
        const { children } = node;
        lns.push({
          ..._.omit(node, ['children']),
          level,
          children: children && children.map(c => c.key),
        });

        if (children && expandedKeys.includes(node.key)) {
          walk(children, level + 1);
        }
      });
    };

    if (treeData != null) {
      walk(treeData);
    }

    return lns;
  }, [treeData, expandedKeys]);

  const expandToLevel = useCallback<(level: number) => void>(level => {
    const keys: string[] = [];
    const walk = (nodes: TreeNode[], l = 0) => {
      if (l > level) {
        return;
      }

      nodes.forEach(node => {
        keys.push(node.key);
        const { children } = node;
        if (children && children.length > 0) {
          walk(children, level + 1);
        }
      });
    };
    if (treeData != null) {
      walk(treeData);
    }
    setExpandedKeys(keys);
  }, [treeData]);

  return {
    dataSource,
    expandedKeys,
    setExpandedKeys,
    expandToLevel,
  };
}

export default useTree;
