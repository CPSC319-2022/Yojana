import React, { ReactElement } from 'react';
import styles from './MainCalendar.module.scss';

interface EventBlockProps {
  color: string;
  label: string;
}

export const EventBlock = (props: EventBlockProps): ReactElement => {
  return <div className={`${styles.eventBlock} ${props.color}`}>{props.label}</div>;
};
