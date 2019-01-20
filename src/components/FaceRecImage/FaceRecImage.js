import React from 'react';

const FaceRecImage = ({ imageUrl, boxes=[] }) => {
    let boxdivs = [];
    const canvas_w = '500px';
    
    for (let i=0; i < boxes.length; i++) {
        let {x1, y1, w, h} = boxes[i];
        //console.log(x1, y1, w, h);
        boxdivs.push(<div key={i} className="ba bw1 grow b--light-blue" 
        style={{ position: 'absolute', zIndex: 1000, top: y1, left: x1, width: w, height: h }}></div>);
    }

    return (
    <div className="center ma3" style={{position: 'relative', width: canvas_w}}>
        {boxdivs}
        <img id="inputimage" src={imageUrl} alt="" width={canvas_w} height="auto"></img>
    </div>
    )
}

export default FaceRecImage;