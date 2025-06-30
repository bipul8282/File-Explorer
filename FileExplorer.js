import React, { useState, useCallback } from 'react';
import fileSystemData from '../data/fileSystem.json';
import TreeNode from './TreeNode';
import SearchBar from './SearchBar';

export default function FileExplorer() {
  const [fs, setFs] = useState(fileSystemData);
  const [selectedFile, setSelectedFile] = useState(null);
  const [query, setQuery] = useState('');

  const updateNode = useCallback((path, newVal) => {
    function recurse(node, p) {
      if (p.length === 1) {
        if (newVal === null) {
          node.children = node.children.filter(c => c.name !== p[0]);
        } else {
          const idx = node.children.findIndex(c => c.name === p[0]);
          if (Array.isArray(newVal)) {
            node.children.push({ name: newVal[1], type: 'file' });
          } else if (typeof newVal === 'string') {
            node.children[idx].name = newVal;
          } else {
            node.children[idx] = { ...node.children[idx], children: [...node.children[idx].children, newVal] };
          }
        }
      } else {
        const nxt = node.children.find(c => c.name === p[0]);
        recurse(nxt, p.slice(1));
      }
    }
    setFs(fs => {
      const copy = JSON.parse(JSON.stringify(fs));
      if (Array.isArray(newVal) && path.length === 0) {
        copy.children.push({ name: newVal[1], type: newVal[0] });
      } else recurse(copy, path);
      return copy;
    });
  }, []);

  const addNew = (type) => {
    const name = prompt(`New ${type} name:`);
    if (!name) return;
    updateNode([], [type, name]);
  };

  const onDropRoot = (e) => {
    e.preventDefault();
    const dragPath = JSON.parse(e.dataTransfer.getData('path'));
    updateNode(dragPath, []);
  };

  return (
    <div className='tree-pane' >
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={onDropRoot}
       >
        <SearchBar query={query} setQuery={setQuery} />
        <div className='action-buttons' >
          <button onClick={() => addNew('folder')}>New Folder</button>
          <button onClick={() => addNew('file')}>New File</button>
        </div>
        <TreeNode node={fs} path={[]} updateNode={updateNode} selectFile={setSelectedFile} query={query} />
      </div>
      <div className='viewer-pane' >
        <h2>Viewer</h2>
        {selectedFile ? (
          <div>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
          </div>
        ) : <p>Select a file to view</p>}
      </div>
    </div>
  );
}