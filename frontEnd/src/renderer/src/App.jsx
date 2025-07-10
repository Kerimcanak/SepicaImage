import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import categoryTray from './components/categoryTray'
function App() {
  const [categories, setCategories] = useState([
    { id: 'favorites', name: 'Favorites', itemIds: ['fav-item-1', 'fav-item-2'] },
    { id: 'memories', name: 'Memories', itemIds: ['mem-item-1', 'mem-item-2', 'mem-item-3'] },
    { id: 'important-for-work', name: 'Important for Work', itemIds: ['work-item-1'] },
  ])

  const [items, setItems] = useState({
    'fav-item-1': 'Favorite Photo A',
    'fav-item-2': 'Favorite Photo B',
    'mem-item-1': 'Holiday 2023',
    'mem-item-2': 'Birthday Party',
    'mem-item-3': 'Old Family Pic',
    'work-item-1': 'Client Project X',
  });

  // Drag and Drop
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Check if the item was dropped outside any valid droppable area
    if (!destination) {
      console.log('Dropped outside a tray. No change.');
      return;
    }

    // Check if the item was dragged to the same spot (no change)
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      console.log('Dropped in the same spot. No change.');
      return;
    }
  };

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
