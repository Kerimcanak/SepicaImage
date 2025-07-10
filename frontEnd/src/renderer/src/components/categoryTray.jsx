// src/renderer/src/components/CategoryTray.jsx

import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd'; // Import DND components

function CategoryTray({ category, items }) {
  // `category` prop contains: { id: 'favorites', name: 'Favorites', itemIds: [...] }
  // `items` prop contains: { 'fav-item-1': 'Favorite Photo A', ... }

  // Filter the global 'items' object to get only the items that belong to *this* specific category.
  // We use `category.itemIds` (which App.jsx manages) to determine what to display here.
  const itemsToDisplay = category.itemIds.map(itemId => items[itemId]);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '12px',
        flex: 1, // Allows this tray to take up equal vertical space in the App's flex container
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#333' }}>{category.name}</h3>

      {/* The Droppable component defines an area where draggable items can be dropped */}
      <Droppable droppableId={category.id}>
        {(provided, snapshot) => (
          <div
            // `provided.droppableProps` should be applied to the most outer element
            // that is acting as a droppable area.
            {...provided.droppableProps}
            // `provided.innerRef` needs to be set on the element that is the DOM node
            // for the droppable area.
            ref={provided.innerRef}
            style={{
              minHeight: '100px', // Ensures the drop area is visible even if empty
              backgroundColor: snapshot.isDraggingOver ? '#e3f2fd' : 'inherit', // Light blue when dragging over
              borderRadius: '5px',
              padding: '8px',
              overflowY: 'auto', // Allows scrolling if many items
              flex: 1, // Makes the content area fill remaining space
            }}
          >
            {/* Message for empty trays */}
            {itemsToDisplay.length === 0 && (
              <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                Drag items here!
              </p>
            )}

            {/* Map over the items belonging to this category and render them as Draggables */}
            {itemsToDisplay.map((itemContent, index) => (
              // Each item needs to be wrapped in a Draggable component
              <Draggable key={itemContent.id} draggableId={itemContent.id} index={index}>
                {(providedDraggable, snapshotDraggable) => (
                  <div
                    // `providedDraggable.innerRef` needs to be set on the DOM node of the draggable item.
                    ref={providedDraggable.innerRef}
                    // `providedDraggable.draggableProps` contains styles and attributes for the draggable element.
                    {...providedDraggable.draggableProps}
                    // `providedDraggable.dragHandleProps` allows you to define which part of the item
                    // can be used to initiate a drag. Applying it to the whole div makes the whole item draggable.
                    {...providedDraggable.dragHandleProps}
                    style={{
                      backgroundColor: snapshotDraggable.isDragging ? '#c8e6c9' : 'white', // Highlight when dragging
                      padding: '10px',
                      marginBottom: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      userSelect: 'none', // Prevents text selection interference during drag
                      ...providedDraggable.draggableProps.style, // Apply DND-provided styles (like position)
                    }}
                  >
                    {/* Display the content of the item (e.g., "Favorite Photo A") */}
                    {itemContent}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder} {/* Essential: Creates space for the dragged item when reordering */}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default CategoryTray;