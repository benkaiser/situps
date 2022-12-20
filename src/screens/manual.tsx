import { getTodayGoal } from '../data/goals';
import { getTodayCount, recordSitups } from '../data/logs';
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


export default function Manual() {
  const situpsDoneRef = React.useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const onSaveSitups = React.useCallback(() => {
    recordSitups(Number(situpsDoneRef.current.value));
    navigate('/');
  }, []);
  const onSaveSitupsNum = React.useCallback((numSitups: number) => {
    recordSitups(numSitups);
    navigate('/');
  }, []);
  const goal = getTodayGoal();
  const count = getTodayCount();
  const sizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100];

  return (
    <React.Fragment>
      <h1>Enter Your Sit-Ups!</h1>
      <p>Manually enter the number of sit-ups you completed:</p>
      <Form>
        <Form.Group className="mb-3" controlId="goalStart">
          <Form.Control type="number" defaultValue={goal - count} ref={situpsDoneRef} />
        </Form.Group>
        <Button variant="success" size='lg' type="submit" onClick={onSaveSitups}>
          Save
        </Button>
        <h3 className='mt-4'>Quick Entry</h3>
        <Row>
          {sizes.map(size =>
            <Col key={size} xs='6' sm='4' className='mt-3'><div className='d-flex'><Button variant='info' className='flex-grow-1' onClick={onSaveSitupsNum.bind(this, size)}>{size}</Button></div></Col>
          )}
        </Row>
      </Form>
    </React.Fragment>
  );
};