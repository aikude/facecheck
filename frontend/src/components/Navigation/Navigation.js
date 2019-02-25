import React from 'react';

const Navigation = ({ onRouteChange, isLoggedin }) => {
    const navsets = {
        loggedIn: [{title: 'Sign Out', route: 'signout'}],
        loggedOut: [{title: 'Register', route: 'register'}, {title: 'Sign In', route: 'home'}],
    }
    let navs = navsets.loggedOut;
    if(isLoggedin) navs = navsets.loggedIn;

    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            {
                navs.map((nav, i) => (
                    <p key={i} onClick={() => onRouteChange(nav.route)} className='f3 link dim black underline pa3 pointer'>
                    {nav.title}
                    </p>
                )) 
            }
        </nav>
    )
}

export default Navigation;