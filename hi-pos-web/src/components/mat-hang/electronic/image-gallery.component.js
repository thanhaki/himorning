import React, { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function MatHangGallery(props) {
  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#' + props.galleryID,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className="pswp-gallery" id={props.galleryID}>
      {props.listImages && props.listImages.map((image, index) => (
        <a
          href={image}
          data-pswp-width={900}
          data-pswp-height={900}
          key={props.galleryID + '-' + index}
          target="_blank"
          rel="noreferrer"
          className='border-img'
        >
          <img src={image} alt="" width={160} style={{border:0}}/>
        </a>
      ))}
    </div>
  );
}
