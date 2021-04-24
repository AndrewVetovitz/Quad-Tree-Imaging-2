import React from 'react';
import './Display.css';

class DisplayImage extends React.Component<DisplayImageProps, DisplayImageState> {
    constructor(props: DisplayImageProps){
        super(props);
    }

    render() {
        return (
        <div className="Border">
            {this.props.imageFile !== '' && <img className="Image-display" alt="uploaded file" src={this.props.imageFile}/>}
        </div>);
    }
}

interface DisplayImageProps {
    imageFile: string
};

interface DisplayImageState {};

export default DisplayImage;
