import React, { useState } from 'react';

export default function TreeNode({ node, path, updateNode, selectFile, query }) {
  const [expanded, setExpanded] = useState(false);
  const isMatch = node.name.toLowerCase().includes(query.toLowerCase());

  if (query && !isMatch && (!node.children || !node.children.some(child => child.name.toLowerCase().includes(query.toLowerCase())))) {
    return null;
  }

  const onDrop = e => {
    e.preventDefault();
    const dragPath = JSON.parse(e.dataTransfer.getData('path'));
    updateNode(dragPath, path.concat(node.name));
  };

  return (
    <div className='tree-node' >
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData('path', JSON.stringify(path))}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
       
      >
        <span onClick={() => node.type === 'folder' && setExpanded(!expanded)}
            //   style={{ cursor: 'pointer', marginRight: 4 }}
              >
          {node.type === 'folder' ? '📁' : '📄'}
        </span>
        <span onClick={() => node.type === 'file' && selectFile(node)} 
        // style={{ cursor: 'pointer', flex: 1 }}
        >
          {node.name}
        </span>
        <button className='icon-btn' onClick={() => {
          const name = prompt('New name', node.name);
          name && updateNode(path, path.slice(0, -1).concat(name));
        }}>✏️</button>
        <button className='icon-btn' onClick={() => updateNode(path, null)}>🗑️</button>
      </div>
      {expanded && node.children?.map((child, i) =>
        <TreeNode
          key={i}
          node={child}
          path={path.concat(node.name, child.name)}
          query={query}
          updateNode={updateNode}
          selectFile={selectFile}
        />
      )}
    </div>
  );
}