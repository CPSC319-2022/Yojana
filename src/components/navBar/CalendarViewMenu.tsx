import React, { ReactElement, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getInterval, setInterval } from '@/reducers/MainCalendarReducer';
import { CalendarInterval } from '@/constants/enums';

export const CalendarViewMenu = (): ReactElement => {
  const dispatch = useDispatch();
  const activeCalView = useSelector(getInterval);

  const onSelect = (selectedKey: string | null) => {
    if (selectedKey !== activeCalView && selectedKey !== null) {
      dispatch(setInterval(selectedKey as CalendarInterval));
    }
  };

  const renderItems = useMemo(() => {
    return Object.values(CalendarInterval).map((view) => {
      return (
        <Dropdown.Item className={`${activeCalView === view && 'active'}`} eventKey={view} key={view}>
          {view}
        </Dropdown.Item>
      );
    });
  }, [activeCalView]);

  return (
    <DropdownButton id='calendar-view-menu' title={activeCalView} onSelect={onSelect}>
      {renderItems}
    </DropdownButton>
  );
};
