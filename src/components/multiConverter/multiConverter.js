import React, {Component} from 'react';
import {Button, Card, CardBody, CardTitle, CardSubtitle, CardText, Form, FormGroup, Input, InputGroup} from 'reactstrap';
import Select from 'react-select';
import querystring from 'querystring';
import fileDownload from 'react-file-download';

import '../Select.css';
import setCurrencyProps from '../hoc/setCurrencyProps';
import apiInstance from '../../http/CurrencyApiInstance';

class MultiConverter extends Component {
  constructor() {
    super();
    this.amountChangeHandler = this.amountChangeHandler.bind(this);
    this.convertHandler = this.convertHandler.bind(this);
  }
  state = {
    currencyList: [],
    fromAmount: 1
  };
  componentDidMount() {
    this.setState({
      fromCurrency: this.props.fromCurrency,
      toCurrency: null
    });
  }
  amountChangeHandler (e) {
    const name = e.target.name;
    const newVal = e.target.value;
    this.setState({
      [name]: newVal
    });
  };
  selectOnChangeHandler (val, name) {
    this.setState({
      [name]: val
    });
  }
  parseConvertError (error) {
    const {message, errors} = error;
    const {amount, to, from} = errors;
    const amountError = amount ? `From amount: ${amount} ` : '';
    const toError = to ? `To currency: ${to} ` : '';
    const fromError = from ? `From currency: ${from} ` : '';
    return `${message}: ${amountError}${toError}${fromError}`
  }
  convertHandler (e) {
    const payload = {
      from: this.state.fromCurrency.value,
      to: this.state.toCurrency ? this.state.toCurrency.map(curr=>curr.value).join(',') : null,
      amount: this.state.fromAmount
    };
    this.setState({
      converting: true,
      error: null
    });
    apiInstance.get(`https://joms-currency-api.herokuapp.com/convert-currency/export-csv?${querystring.stringify(payload)}`).then(res=>{
      const filename = `${payload.from}_to_${payload.to}.csv`;
      fileDownload(res.data, filename);
    }).catch(e=>{
      this.setState({
        error: this.parseConvertError(e.response.data)
      });
    }).finally(()=>{
      this.setState({
        converting: false
      });
    });
  }

  render() {
    const currencySelect = (name, options) => { return this.props.currencyList ? <Select
      defaultValue={options && options.isMulti ? null : this.props.currencyList[0]}
      name={name}
      options={this.props.currencyList}
      className="basic-multi-select"
      classNamePrefix="select"
      isSearchable
      onChange={(val)=>this.selectOnChangeHandler(val, name)}
      {...options}
    /> : null };

    return (
      <Card>
        <CardBody>
          <Form>
            <FormGroup>
              <CardTitle>
                Export
              </CardTitle>
              <CardSubtitle>
                Convert to multiple currency
              </CardSubtitle>
              {this.state.error ? (<CardText className="text-danger">{this.state.error}</CardText>) : null}
              <InputGroup>
                <Input placeholder="From" value={this.state.fromAmount} onChange={this.amountChangeHandler} name="fromAmount"/>
                <div style={{width:  '50%'}}>
                  {currencySelect('fromCurrency')}
                </div>
              </InputGroup>
              <CardText className="text-center" style={{marginTop: '10px'}}>
                To
              </CardText>
                {currencySelect('toCurrency', {isMulti: true})}
              <div className="text-center" style={{marginTop: '10px'}}>
                <Button color="primary" type="button" onClick={this.convertHandler} disabled={this.state.converting}>
                  {this.state.converting ? 'Converting...' : 'Convert'}
                </Button>
              </div>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    )
  }
}

export default setCurrencyProps(MultiConverter);