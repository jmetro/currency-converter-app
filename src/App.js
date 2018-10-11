import React, {Component} from 'react';
import {Container, Row, Col, Card} from 'reactstrap';

import './App.css';

import SingleConverter from './components/singleConverter/SingleConverter';
import MultiConverter from './components/multiConverter/multiConverter';
//import SetCurrencyToProps from './components/hoc/setCurrencyToPropsHoc';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Container>
            <Row>
              <Col sm={12} md={6} lg={{size: 4, offset: 2}}>
                  <SingleConverter/>
              </Col>
              <Col sm={12} md={6} lg={4}>
                  <MultiConverter/>
              </Col>
            </Row>
          </Container>
      </div>
    );
  }
}

export default App;
