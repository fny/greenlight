import React from 'react'
import { SelectRowProps } from 'react-bootstrap-table-next'
import { OnChangeEvent } from '../common/types';

function SelectionCheckbox({ isSelected, onChange }: { isSelected: boolean, onChange: OnChangeEvent}) {
  return (
    <>
      <input type="checkbox" style={{ display: "none" }} />
      <label className="checkbox checkbox-single">
        <input type="checkbox" checked={isSelected} onChange={onChange} />
        <span />
      </label>
    </>
  );
}

function groupingItemOnSelect(props: any) {
  const { ids, setIds, customerId } = props;
  if (ids.some((id: string) => id === customerId)) {
    setIds(ids.filter((id: string) => id !== customerId));
  } else {
    const newIds = [...ids];
    newIds.push(customerId);
    setIds(newIds);
  }
}

function groupingAllOnSelect(props: any) {
  const { isSelected, setIds, entities } = props;
  if (!isSelected) {
    const allIds: string[] = [];
    entities.forEach((el: any) => allIds.push(el.id));
    setIds(allIds);
  } else {
    setIds([]);
  }

  return isSelected;
}

// check official documentations: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Row%20Selection&selectedStory=Custom%20Selection%20Column%20Header%20Style&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
export function getSelectRow(props: any): SelectRowProps<any> {
  const { entities, ids, setIds } = props;
  return {
    mode: "checkbox",
    clickToSelect: true,
    hideSelectAll: false,
    selectionHeaderRenderer: () => {
      const isSelected =
        entities && entities.length > 0 && entities.length === ids.length;
      const props = { isSelected, entities, setIds };
      return (
        <SelectionCheckbox
          isSelected={isSelected}
          onChange={() => groupingAllOnSelect(props)}
        />
      );
    },
    selectionRenderer: ({ rowIndex }: { rowIndex: number }) => {
      const isSelected = ids.some((id: string) => id === entities[rowIndex].id);
      const props = { ids, setIds, customerId: entities[rowIndex].id };
      return (
        <SelectionCheckbox
          isSelected={isSelected}
          onChange={() => groupingItemOnSelect(props)}
        />
      );
    },
  };
}
