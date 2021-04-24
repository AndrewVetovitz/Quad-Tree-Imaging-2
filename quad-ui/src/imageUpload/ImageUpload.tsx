import React from 'react';
import Button from '@material-ui/core/Button';

class ImageUpload extends React.Component<ImageUploaderProps, ImageUploaderState> {
    constructor(props: ImageUploaderProps){
        super(props)

        this.handleChange = this.handleChange.bind(this)
      }

      handleChange(event: any) {
        const url: string = URL.createObjectURL(event.target.files[0]);
        this.props.setFile(url);
        console.log(url);
      }

      render() {
        return (
          <Button variant="contained" component="label">
            Upload File
            <input
              type="file"
              hidden
              onChange={this.handleChange}
            />
          </Button>
        );
      }
}

interface ImageUploaderProps {
  setFile: Function
};

interface ImageUploaderState {};

export default ImageUpload;
