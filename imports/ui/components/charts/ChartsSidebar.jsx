import React from 'react';
import { Meteor } from 'meteor/meteor';
import Charts from '../../../api/charts/charts_collection.js';
import { default as momentUtil } from 'moment';
import moment from 'moment-timezone';
import EverAfter from 'react-everafter';
import useSubscribe from '../../hooks/useSubscribe';

function ChartsSidebar() {
  let state = useSubscribe({
    charts: []
  }, function (fxn) {
    return Meteor.subscribe('charts', {
      onReady: function() {
        fxn({
          charts: Charts.find({}, { sort: { chartDate: -1, title: 1 } }).fetch()
        });
      }
    });
  });

  function dateFmt(date) {
    return momentUtil(moment(date, 'Pacific/Honolulu')).format('MMMM DD, YYYY');
  }

  if (state.charts) {
    return (
      <div className='playlist__sidebar'>
        <h6>More Charts</h6>
        <EverAfter.TablePaginator className="playlist-list__table"
          perPage={8} items={state.charts}
          truncate={true} columns={[{
            headerText: '',
            display:
            ({ slug, title, chartDate }) => <a href={`/charts/${slug}`}>
              <p className='home__title'>
                {`${title} - ${dateFmt(chartDate)}`}
              </p>
            </a>
          }]} />
      </div>);
  }
  else return null;
}

export default ChartsSidebar;
