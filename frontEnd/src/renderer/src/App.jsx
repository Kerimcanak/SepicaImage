import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import CategoryTray from './components/categoryTray';

function App() {
  const [categories, setCategories] = useState([
    { id: 'favorites', name: 'Favorites', itemIds: ['fav-item-1', 'fav-item-2'] },
    { id: 'memories', name: 'Memories', itemIds: ['mem-item-1', 'mem-item-2', 'mem-item-3'] },
    { id: 'important-for-work', name: 'Important for Work', itemIds: ['work-item-1'] },
  ]);

  const [items, setItems] = useState({
    'fav-item-1': 'Favorite Photo A',
    'fav-item-2': 'Favorite Photo B',
    'mem-item-1': 'Holiday 2023',
    'mem-item-2': 'Birthday Party',
    'mem-item-3': 'Old Family Pic',
    'work-item-1': 'Client Project X',
  });

  // Drag and Drop
  const onDragEnd = (result) => { // <--- Start of onDragEnd function
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

    // --- LOGIC FOR UPDATING STATE BASED ON DRAG ---
    // This part handles both reordering within a tray and moving between trays.
    setCategories((prevCategories) => {
      // Find the source and destination categories by their IDs
      const sourceCategory = prevCategories.find(cat => cat.id === source.droppableId);
      const destinationCategory = prevCategories.find(cat => cat.id === destination.droppableId);

      // Create *copies* of the item ID arrays to modify them immutably
      const newSourceItemIds = Array.from(sourceCategory.itemIds);
      const newDestinationItemIds = source.droppableId === destination.droppableId
                                  ? newSourceItemIds // If same list, work on the same array copy
                                  : Array.from(destinationCategory.itemIds);

      // 1. Remove the dragged item from its source position
      const [movedItem] = newSourceItemIds.splice(source.index, 1);

      // 2. Insert the dragged item into its new destination position
      newDestinationItemIds.splice(destination.index, 0, movedItem);

      // 3. Return a new array of categories with the updated itemIds arrays
      return prevCategories.map(cat => {
        if (cat.id === sourceCategory.id) {
          return { ...cat, itemIds: newSourceItemIds };
        }
        if (cat.id === destinationCategory.id) {
          return { ...cat, itemIds: newDestinationItemIds };
        }
        return cat;
      });
    });

    console.log(`Dragged item ${draggableId} from ${source.droppableId} (index ${source.index}) to ${destination.droppableId} (index ${destination.index}).`);
    // In a real app, this is where you'd send updates to your Python backend!
  }; // <--- End of onDragEnd function (moved it down)

  return (
    // The main layout of your application
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* DragDropContext wraps everything that can be dragged or dropped */}
      <DragDropContext onDragEnd={onDragEnd}>
        {/* This div will contain your three CategoryTray components */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', gap: '15px' }}>
          {/* Render each CategoryTray component */}
          {categories.map((category) => (
            <CategoryTray
              key={category.id}      // React needs a unique key for list items
              category={category}    // Pass the category object (id, name, itemIds)
              items={items}          // Pass the global map of item details
            />
          ))}
        </div>
      </DragDropContext>

      {/* This is just a placeholder for the right-side panel, not related to DND core */}
      <div style={{ width: '300px', borderLeft: '1px solid #eee', padding: '10px' }}>
        <h2>Right Panel Placeholder</h2>
        <p>Drag items in the left panel and check your browser's console (F12).</p>
      </div>
    </div>
  );
}

export default App;