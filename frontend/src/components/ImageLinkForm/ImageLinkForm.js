import React from 'react';

const ImageLinkForm = ({ onInputChange, onImageUrlSubmit }) => {
    return (
        <div>
            <p className="f3">
                {"Paste the link to any picture below, and I'll find the faces in it"}
            </p>
            <div className="form pa4 br3 w-60-ns center shadow-5">
                <input type="text" className="f4 pa2 w-70 center" onChange={onInputChange} />
                <button className="w-30 grow f4 link pa2 dv2 dib white bg-light-purple" onClick={onImageUrlSubmit}>Detect</button>
            </div>
        </div>
    )
}

export default ImageLinkForm; 