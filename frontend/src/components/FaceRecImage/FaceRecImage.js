import React from 'react';

// Displays image in page, and adds facial highlight boxes after face detection scan returns from server
const FaceRecImage = ({ imageUrl, boundingBoxes=[] }) => {
    const canvas_w = '500px';

    return (
    <div className="center ma3" style={{position: 'relative', width: canvas_w}}>
        {
            boundingBoxes.map((box, i) => <div key={i} className="ba bw1 grow b--light-blue" 
                style={{ position: 'absolute', zIndex: 1000, top: box.y1, left: box.x1, width: box.w, height: box.h }}></div>
            )
        }
        <img id="inputimage" src={imageUrl} alt="" width={canvas_w} height="auto"></img>
    </div>
    )
}

export default FaceRecImage;