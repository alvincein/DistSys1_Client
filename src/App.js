import React from 'react';
import './App.css';
import { Button, Input, Card, Skeleton} from 'antd';
import 'antd/dist/antd.css';
import { Switch } from 'antd';
import API from '../src/utils/API'
import RPC from '../src/utils/RPC'


export default class App extends React.Component {

    // Setting our states
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
            isLoading: true,
            rpcEnabled: false,
            apiOrRpc: "API"
        };
        // Binding our methods
        this.onChangeId = this.onChangeId.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.onIdSearch = this.onIdSearch.bind(this);
        this.onSwitchChange = this.onSwitchChange.bind(this);
    }

    // Changes state when id is changed
    onChangeId(event){
        this.setState({ tempId: event.target.value });
    }

    // Changes state when given amount is changed
    onChangeAmount(event){
        this.setState({ amount: event.target.value });
    }


    // Triggers when submiting a user id
    onIdSearch(){
        if(this.state.tempId !== undefined){
            // Start loading
            this.setState({isLoading : true});

            // If switch is on API
            if(!this.state.rpcEnabled){

                // API CALL
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
                            // Set found user
                            this.setState({
                                errorMessage : "",
                                id: this.state.tempId,
                                name : response.data.name,
                                surname : response.data.surname,
                                balance : response.data.balance,
                                userFound : true
                            });
                            // Stop loading
                            this.setState({isLoading : false});
                        }
                });
            }
            // If switch is on RPC
            else{
                // RPC CALL
                // Same with API call but you have to give "method" name
                // Also you POST to /rpc , not to /api.
                RPC.post('/',{
                    "method" : "getUser",
                    "id" : this.state.tempId
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
                        // Set found user
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
    }

    onAction(action){

        // If switch is on API
        if(!this.state.rpcEnabled){
            // API CALL
            API.post(action,{
                "id": this.state.id,
                "amount" : this.state.amount
            })
            .then(res => {
                const response = res.data;
                console.log(response)
                this.setState({result : "Νέο υπόλοιπο: " + response.balance + " €"});
                this.onIdSearch();
            })
            .catch(err => {
                if (err.response.data.message === "error"){
                this.setState({result : err.response.data.error});
                }
            })
        }
        // If switch is on RPC
        else{
            // RPC CALL
            RPC.post('/',{
                "method" : action,
                "id": this.state.id,
                "amount" : this.state.amount
            })
            .then(res => {
                const response = res.data;
                console.log(response)
                this.setState({result : "Νέο υπόλοιπο: " + response.balance + " €"});
                this.onIdSearch();
            })
            .catch(err => {
                console.log(err);
                if (err.response.data.message === "error"){
                this.setState({result : err.response.data.error});
                }
            })
        }
    }

    onSwitchChange(){
        if(this.state.rpcEnabled === false){
            this.setState({
                rpcEnabled : !this.state.rpcEnabled,
                apiOrRpc: "RPC"
            });
        }
        else{
            this.setState({
                rpcEnabled : !this.state.rpcEnabled,
                apiOrRpc: "API"
            });
        }

    }

    render(){
        return (
            <div className="App">
            <header className="App-header">
                <h1 style={{color:"#66a8ff"}}>ΑΤΜ</h1>
                <h2 style={{color:"#ffffff"}}>{this.state.apiOrRpc}</h2>
                <Switch defaultChecked={this.state.rpcEnabled} onChange={this.onSwitchChange}></Switch>
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
                    <p>Υπόλοιπο: {this.state.balance} €</p>
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