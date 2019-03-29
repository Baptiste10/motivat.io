import React from 'react';
import SimpleImageSlider from "react-simple-image-slider";

class ImageGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lightboxIsOpen:true
    }
  }

  closeLightbox = () => {
    this.setState({lightboxIsOpen:false})
  }

  openLightBox = () => {
    this.setState({lightboxIsOpen:true})
  }


  render() {
    const images=[
              { url: 'https://farm8.staticflickr.com/7922/46764088704_90ee469706_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7867/46572133855_e0dc47c509_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7832/47434570422_7abf94537b_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7860/46572133785_1534d9eda7_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7919/46572134035_86460e071e_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7909/47434570572_1f3791f2aa_b.jpg' },
              { url: 'https://farm8.staticflickr.com/7812/46572133915_12bb56de55_b.jpg' }
              ]

      return (
        <div>
            <SimpleImageSlider
                width={1500}
                height={635}
                images={images}
            />
        </div>
    );
  }
}

export default ImageGrid