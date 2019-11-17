import React from 'react';
import Comments from '../../../api/comments/comments_collection.js';
import CommentItem from '../comments/CommentItem.jsx';
import { displayNameById, dateFormat } from '../../../startup/lib/helpers.js';
import { Metamorph } from 'react-metamorph';

function SSRNewsPage({ post: { author, thumbnail, title, summary, userId, photo,
  submitted, body }, comments }) {
  return [
    <Metamorph title={`${title} - KTUH FM Honolulu | Radio for the People`}
      description={summary}
      image={thumbnail || 'https://ktuh.org/img/ktuh-logo.png'} />,
    <h1 key="header-title" className='general__header'>{title}</h1>,
    <div key="radioblog-back-link" className='show__link'>
      <a href='/radioblog' className='back-to'>← Back to Radioblog</a>
    </div>,
    <div className='news-item' key="name-submitted">
      <p className='news-item__author'>
        {author && <b>Posted by <a href={`/profile/${author}`}>
          {displayNameById(userId) || author}</a></b> || null}
        <br />
        {dateFormat(submitted, 'dddd, MMMM DD, YYYY')}
      </p>
      <img className='news-item__photo' src={thumbnail || (photo && photo.url)
        || '/mstile-310x310.png'} />
      <div className='news-item__body'
        dangerouslySetInnerHTML={{ __html: body }} />
      <div className='comments'><h3 className='comments__header'>Comments</h3>
        {comments.length && <ul className='comments__list'>
          {comments.map((comment) =>
            <CommentItem key={comment._id} {...{ comment }}/>)}
        </ul> || null}
      </div>
    </div>
  ]
}

export default (post) =>
  <SSRNewsPage post={post} comments={Comments.find({ _id: post._id })} />;
