import React from 'react';
import './App.css';
import { Button, Input, Card, Skeleton} from 'antd';
import API from './utils/API';
import 'antd/dist/antd.css';


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        tempId: undefined,
        id: undefined,
        name: undefined,
        surname: undefined,
        balance: undefined,
        amount: undefined,
        result: undefined,
        userFound: false,
        errorMessage: "",
        isLoading: true
    };
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onIdSearch = this.onIdSearch.bind(this);
  }

  onChangeId(event){
    this.setState({ tempId: event.target.value });
  }
  
  onChangeAmount(event){
    this.setState({ amount: event.target.value });
  }


  onIdSearch(){
    if(this.state.tempId !== undefined){
      this.setState({isLoading : true});
      API.get('members/' + this.state.tempId , {
        headers : {"Content-Type": "application/x-www-form-urlencoded"}
      })
      .then(res => {
        const response = res.data;
        console.log(response);
        if (response.message === "error"){
          console.log(response.error);
          this.setState({ 
            errorMessage : response.error,
            userFound : false
        })
        }
        else {
          if(this.state.tempId !== this.state.id){
            this.setState({result: ""})
          }
          this.setState({
            errorMessage : "",
            id: this.state.tempId,
            name : response.data.name,
            surname : response.data.surname,
            balance : response.data.balance,
            userFound : true
          });
        this.setState({isLoading : false});
        }
      });
    }
  }

  onAction(action){
    API.post(action,{
      "id": this.state.id,
      "amount" : this.state.amount
    })
    .then(res => {
      const response = res.data;
      this.setState({result : "Νέο υπόλοιπο: " + response.data});
      this.onIdSearch();
    })
  }

  render(){
      return (
        <div className="App">
          <header className="App-header">
            <h1 style={{color:"#66a8ff"}}>ΑΤΜ</h1>
          <div className="master-flex-row">
            <div className="flex-column-margin">Στοιχεία Μέλους
            <Input placeholder="ID" onChange={this.onChangeId}></Input>
            <div style={{color : "red" , fontSize : "15px"}}>{this.state.errorMessage}</div>
            <hr></hr>
            <Button type="primary" onClick={this.onIdSearch}>Αναζήτηση χρήστη</Button>
            <hr></hr>
            <Card title="Στοιχεία Χρήστη">
              {this.state.isLoading ?

              <Skeleton active></Skeleton>

              :

              <div>
                <p>ID: {this.state.id}</p>
                <p>Όνομα: {this.state.name}</p>
                <p>Επώνυμο: {this.state.surname}</p>
                <p>Υπόλοιπο: {this.state.balance}</p>
              </div>

              }

            </Card>
            </div>
            <div className="flex-column-margin">
            <Input placeholder="Ποσό" disabled={!this.state.userFound} onChange={this.onChangeAmount}></Input>
            <hr></hr>
            <Button type="primary" disabled={!this.state.userFound} onClick={() => this.onAction("withdraw")}>Ανάληψη</Button>
            <hr></hr>
            <Button type="primary" disabled={!this.state.userFound} onClick={() => this.onAction("deposit")}>Κατάθεση</Button>
            <hr></hr>
            <Card title={this.state.result}></Card>
            </div>
          </div>

          </header>
        </div>
      );
  }
}