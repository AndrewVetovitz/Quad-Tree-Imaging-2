
import React from 'react';

class ImageUpload extends React.Component<any, any> {
    constructor(props: any){
        super(props)
        this.state = {
          file: null
        }
        this.handleChange = this.handleChange.bind(this)
      }

      handleChange(event: any) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
      }

      render() {
        return (
          <div>
            <input type="file" onChange={this.handleChange}/>
            <img alt="uploaded file" src={this.state.file}/>
          </div>
        );
      }
}

export default ImageUpload;
