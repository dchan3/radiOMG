import React from 'react';
import { getPathBySlug } from '../../../startup/lib/helpers.js';

export default function NewsListLatestReviewsItem({ review: {
  _id, slug, image, artist, releaseName
} }) {
  return (
    <div className='news-list__latest-review' key={_id}>
      <a href={getPathBySlug('/reviews/:slug', slug)}>
        <img src={image && image.url || '/mstile-310x310.png'} />
        <p><b>{artist}</b></p>
        <p>{releaseName}</p>
      </a>
    </div>
  );
}
