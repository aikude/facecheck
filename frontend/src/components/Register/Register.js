import React from 'react';
import { SERVER_URL } from '../../constants';

class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            registerEmail: '',
            registerPassword: '',
            registerName: ''
        }
    }

    onFieldChange = (event) => {
        const field = event.target;
        if (field.id === 'email-address') this.setState({registerEmail: field.value});
        else if (field.id === 'password') this.setState({registerPassword: field.value});
        else if (field.id === 'name') this.setState({registerName: field.value});
    }

    onSubmitRegister = () => {
        const endpoint = SERVER_URL + '/register';
        const newRegData = {name: this.state.registerName, email: this.state.registerEmail, password: this.state.registerPassword};
        
        fetch(endpoint, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newRegData)
        })
        .then(response => response.json())
        .then(data => {
            if (typeof data === 'object' && data !== null && data.hasOwnProperty('email') && data.email === newRegData.email){
                this.props.loadUser(data);
                this.props.onRouteChange('home');
            }
        });
        
    }

    render(){
        return (
            <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" 
                        name="name"  id="name" onChange={this.onFieldChange} />
                    </div>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" 
                        name="email-address"  id="email-address" onChange={this.onFieldChange} />
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" 
                        name="password"  id="password" onChange={this.onFieldChange} />
                    </div>
                    </fieldset>
                    <div className="">
                    <input onClick={this.onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f3 dib" type="submit" value="Enter" />
                    </div>
                </div>
            </main>
            </article>
        )
    }
}

export default Register;