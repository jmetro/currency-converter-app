import React, {Component} from 'react';
import axios from 'axios';

const setCurrencyProps = (WrappedComponent) => {
  return class SetCurrencyProps extends Component {
    state = {};
    componentDidMount() {
      this.setState({
        fetching: true
      });
      axios.get('https://free.currencyconverterapi.com/api/v6/currencies').then(data=>{
        const res = data.data.results;
        const currencyList = [];
        for(let key in res){
          currencyList.push({
            value: key,
            label: `${key} (${res[key].currencyName})`
          })
        }
        this.setState({
          currencyList,
          fromCurrency: {...currencyList[0]},
          toCurrency: {...currencyList[0]}
        });
      }).catch(error=>{
        console.log(error);
        this.setState({
          currencyList: []
        });
      }).finally(()=> this.setState({
        fetching: false
      }));
    }

    render() {
      const {
        currencyList,
        fromCurrency,
        toCurrency
      } = this.state;
      const propsToSend = {
        currencyList,
        fromCurrency,
        toCurrency
      };
      return this.state.fetching ? null : <WrappedComponent {...propsToSend} />;
    }
  }
};

export default setCurrencyProps;