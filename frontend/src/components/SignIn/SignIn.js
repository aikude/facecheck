import React from 'react';
import { SERVER_URL } from '../../constants';

class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    onFieldChange = e => this.setState({ [e.target.name]: e.target.value });

    // Handle submission and login user
    // Login is for demo purposes, no route level access control here/yet
    onSubmitSignin = () => {
        const endpoint = SERVER_URL + '/signin';
        const loginData = {email: this.state.email, password: this.state.password};
        
        fetch(endpoint, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {if (data && data.hasOwnProperty('email') && data.email === loginData.email){
            this.props.loadUser(data);
            this.props.onRouteChange('home');
        }});
        
    }

    render(){
        const { onRouteChange } = this.props;
        return (
            <article className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" 
                            name="email"  id="email" onChange={this.onFieldChange} />
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" 
                            name="password"  id="password" onChange={this.onFieldChange} />
                    </div>
                    </fieldset>
                    <div className="">
                    <input onClick={this.onSubmitSignin} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f3 dib" type="submit" value="Sign in" />
                    </div>
                    <div className="lh-copy mt3">
                    <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                    </div>
                </div>
            </main>
            </article>
        )
    }
}

export default SignIn;