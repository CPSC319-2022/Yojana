import React, { ReactElement } from 'react';
import styles from './NavBar.module.scss';
import { Button } from 'react-bootstrap';
import { CalendarViewMenu } from './CalendarViewMenu';
import { useDispatch, useSelector } from 'react-redux';
import { decrementDate, getDate, incrementDate } from '@/reducers/MainCalendarReducer';

export const NavBar = (): ReactElement => {
  const dispatch = useDispatch();
  const targetDate = useSelector(getDate);

  return (
    <div className={styles.navBar}>
      <h1>Calendar</h1>
      <Button onClick={() => dispatch(decrementDate())}>&lt;</Button>
      <h4>{targetDate.format('MMMM')}</h4>
      <Button onClick={() => dispatch(incrementDate())}>&gt;</Button>
      <CalendarViewMenu />
    </div>
  );
};
