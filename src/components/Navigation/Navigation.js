import React from 'react';

const Navigation = ({ onRouteChange, isLoggedin }) => {
    let navdivs = [];
    const navsets = {
        loggedIn: [{title: 'Sign Out', route: 'signout'}],
        loggedOut: [{title: 'Register', route: 'register'}, {title: 'Sign In', route: 'home'}],
    }
    let navs = navsets.loggedOut;
    if(isLoggedin) navs = navsets.loggedIn;

    for (let i=0; i < navs.length; i++){
        navdivs.push(<p key={i} onClick={() => onRouteChange(navs[i].route)} className='f3 link dim black underline pa3 pointer'>{navs[i].title}</p>);
    }

    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            {navdivs}
        </nav>
    )
}

export default Navigation;