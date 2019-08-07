import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Pages from '../../../api/pages/pages_collection.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Metamorph } from 'react-metamorph';
import { FlowRouter } from 'meteor/kadira:flow-router';

function PagesItem({ ready, page }) {
  if (ready) {
    let { title, body } = page;
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

PagesItem.propTypes = {
  ready: PropTypes.bool,
  page: PropTypes.object
};

export default withTracker(() => {
  let slug = FlowRouter.getParam('slug'),
    s1 = Meteor.subscribe('singlePage', slug, {
      onStop: function() {
        FlowRouter.go('/not-found');
      }
    });

  return {
    ready: s1.ready(),
    page: Pages.findOne({ slug: slug, isDraft: false })
  }
})(PagesItem);
