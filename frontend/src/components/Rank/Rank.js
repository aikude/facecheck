import React from 'react';

const Rank = ({name, entries}) => {
    return (
        <p className='white f2'>Hi {name}, your entries are now:<br></br><span className="f1">{entries}</span></p>
    )
}

export default Rank;