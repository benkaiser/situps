import { getTodayCount, recordSitups } from '../data/logs';
import { Check } from 'react-bootstrap-icons';
import { getTodayGoal } from '../data/goals';
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import React from 'react';

const DEBOUNCE_TIMEOUT = 500;
export default function Record() {
  const [count, setCount] = React.useState(0);
  const [touching, setTouching] = React.useState(false);
  const [ignore, setIgnore] = React.useState(false);
  const navigate = useNavigate();
  const save = React.useCallback(() => {
    recordSitups(count);
    navigate('/');
  }, [count]);
  const touchingTimeout = React.useRef<number>();

  const completedSitups = getTodayCount() + count;
  const goal = getTodayGoal();
  let message = '';
  let messageVariant = 'success';
  if (completedSitups < goal) {
    message = `${goal - completedSitups} left to go!`;
    messageVariant = 'primary';
  } else if (completedSitups === goal) {
    message = 'Goal achieved!';
  } else {
    message = 'You\'re killing it!';
  }

  return (
    <React.Fragment>
      <div
        className={'clickSurface ' + (touching ? 'touching': '')}
        onTouchStart={() => {
          if (ignore) {
            return;
          }
          clearTimeout(touchingTimeout.current);
          setTouching(true);
          setCount(count => count + 1);
          setIgnore(true);
          setTimeout(() => setIgnore(false), DEBOUNCE_TIMEOUT);
          touchingTimeout.current = setTimeout(() => setTouching(false), DEBOUNCE_TIMEOUT);
        }}
        onTouchEnd={() => {
          clearTimeout(touchingTimeout.current);
          setTouching(false);
        }}
      >
        <div className='counter display-1'>{ count }</div>
      </div>
      <Alert variant={messageVariant} className='goalInfo'>{message}</Alert>
      <Button className='saveBtn' variant='success' size='sm' onClick={save}><Check size={48} /></Button>
    </React.Fragment>
  )
}