import React from 'react';

export default function HomeContentReviewsItem(
  { item: { slug, thumbnail, image, _id, artist, releaseName } }) {
  return <div key={_id} className='home__reviews-item'>
    <a href={`/reviews/${slug}`}>
      <img className='home__reviews-img' src={thumbnail ||
        (image && image.url) || '/mstile-310x310.png'} />
      <p className='home__title'>{artist}</p>
      <p className='home__subtitle'>{releaseName}</p>
    </a>
  </div>;
}
