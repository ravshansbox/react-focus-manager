import { ComponentType } from 'react';
import * as classes from './App.module.scss';
import { Focusable } from './focus-manager/Focusable';
import { FocusProvider } from './focus-manager/FocusProvider';

const itemCounts = new Array(8).fill(8);

export const App: ComponentType = () => {
  return (
    <FocusProvider>
      {itemCounts.map((itemCount, rowIndex) => (
        <div key={rowIndex} className={classes.row}>
          {new Array(itemCount).fill(0).map((_, itemIndex) => (
            <Focusable
              key={itemIndex}
              className={classes.item}
              focusedClassName={classes.focused}
              onBlur={() => console.log(`blurred ${rowIndex}-${itemIndex}`)}
              onFocus={() => console.log(`focused ${rowIndex}-${itemIndex}`)}
            >
              <span>{`${rowIndex + 1} - ${itemIndex + 1}`}</span>
            </Focusable>
          ))}
        </div>
      ))}
    </FocusProvider>
  );
};
