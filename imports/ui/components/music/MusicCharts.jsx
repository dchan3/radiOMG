import React from 'react';
import Charts from '../../../api/charts/charts_collection.js';
import { Meteor } from 'meteor/meteor';
import { default as momentUtil } from 'moment';
import EverAfter from 'react-everafter';
import useSubscribe from '../../hooks/useSubscribe';

function MusicCharts() {
  let state = useSubscribe({
    charts: []
  }, function (fxn) {

    return Meteor.subscribe('charts', {
      onReady: function() {
        fxn({
          chart: Charts.find({ sort: { createdAt: -1 } }).fetch()
        });
      }
    });
  });

  if (state.charts) {
    return <div className='music__playlists'>
      <h2>Charts</h2>
      <div>
        <EverAfter.TablePaginator perPage={8} className="playlist-list"
          items={state.charts} truncate={true} columns={[{
            headerText: 'Chart Title',
            display: ({ title }) => title
          }, {
            headerText: 'Chart Date',
            display: ({ chartDate }) =>
              momentUtil(chartDate).format('MMMM DD, YYYY')
          }, {
            headerText: 'Modified At',
            display: ({ slug, editedAt }) => <a href={`/charts/${slug}`}>
              {momentUtil(editedAt).format('MMMM DD, YYYY HH:mm A')}
            </a>
          }]}/>
      </div>
    </div>;
  }
  else return null;
}

export default MusicCharts;
