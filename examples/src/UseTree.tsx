import * as _ from 'lodash';
import * as React from 'react';
import { useTree } from '../../src';
import { TreeNode } from '../../src/types';

interface Node extends TreeNode {
  title: string;
}

function buildTree(): Node[] {
  const level = 5;
  const gen: (level: number) => Node[] = l => {
    if (l <= level) {
      return _.range(2).map(i => ({
        key: _.uniqueId(),
        title: `${i}`,
        children: gen(l + 1),
      }));
    }

    return [];
  };
  return gen(0);
}

const treeData = buildTree();

function UseTree() {
  const {
    dataSource, expandedKeys, expandToLevel, setExpandedKeys,
  } = useTree<Node>(treeData);

  return (
    <div>
      {JSON.stringify(dataSource)}
    </div>
  );
}

export default UseTree;
