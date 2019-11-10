import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import Pages from '../../../api/pages/pages_collection.js';
import { Metamorph } from 'react-metamorph';
import { FlowRouter } from 'meteor/kadira:flow-router';

function PagesItem() {
  let [state, setState] = useState({
    page: null
  });

  useEffect(function() {
    let slug = FlowRouter.getParam('slug');
    Meteor.subscribe('singlePage', slug, {
      onReady: function() {
        setState({ page: Pages.findOne({ slug: slug, isDraft: false }) });
      },
      onStop: function() {
        FlowRouter.go('/not-found');
      }
    });
  }), [state.page];

  if (state.page) {
    let { title, body } = state.page;
    return [
      <Metamorph title={`${title} - KTUH FM Honolulu | Radio for the People`}
        image='https://ktuh.org/img/ktuh-logo.jpg' description={`${
          title} - KTUH FM Honolulu | Radio for the People`} />,
      <h2 className='general__header' key='header-title'>{title}</h2>,
      <div className="page__content" key='page-content'
        dangerouslySetInnerHTML={{ __html: body }} />];
  }
  else return null;
}

export default PagesItem;
